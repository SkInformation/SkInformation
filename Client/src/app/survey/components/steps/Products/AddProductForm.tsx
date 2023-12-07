import {ChangeEvent, FormEvent, useContext, useEffect, useState} from "react";
import apiRequest, {HttpMethod} from "@/app/lib/api"
import {
    Button,
    FormControl,
    Input,
    InputLabel,
    TextField,
    Modal,
    MenuItem,
    Typography, Hidden
} from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from "@mui/material/Box";
import {Product, Ingredient, Reaction} from "@/app/shared/types";
import Grid from "@mui/material/Unstable_Grid2";
import styles from '@/app/page.module.css'

export default function AddProductForm() {
    const [openProductForm, setOpenProductForm] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState<Number[]>([]);
    const [ingredientsList, setIngredientsList] = useState<[]>([]);
    const [productId, setProductId] = useState();
    const [selectFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if(ingredientsList.length == 0) {
            getIngredients();
        }
    }, [])

    // Modal Style
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    // Product Form Stuff
    let newProduct = {
        Id: "",
        Name: "",
        Description: "",
        Thumbnail: "",
        Type: "",
        Url: ""
    }

    const skinTypeSelectData = [
        'Cleanser',
        'Moisturizer',
        'Serum',
        'Sunscreen'
    ]

    /*  Product Add Modal */

    /**
     * Handler for opening product form
     */
    const handleOpenProductForm = () => setOpenProductForm(true);

    /**
     * Handler for closing product form
     */
    const handleCloseProductForm = () => setOpenProductForm(false);

    /**
     * Form handler for saving the new product
     *
     * @param event
     */
    const handleProductSave = async (event: FormEvent): Promise<any> => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('Name', newProduct.Name);
        formData.append('Description', newProduct.Description);
        formData.append('Type', newProduct.Type);
        formData.append('Url', newProduct.Url);
        formData.append('Thumbnail', selectFile, selectFile.name);

        // Make the call to the API
        const response = apiRequest<any>(HttpMethod.POST, '/Product/Create', {}, {}, formData);

        // Handle response form API.
        response.then((apiResponse) => {
            if(apiResponse.id > 0) {
                newProduct.Id = apiResponse.id;
                setProductId(apiResponse.id)

                // Handle Ingredients save
                handleIngredientsSave(apiResponse.id, selectedIngredients)
            }
        })
    }

    /**
     * Handler for new product type selection
     *
     * @param event
     */
    const handleProductTypeChange = (event: SelectChangeEvent) => {
        newProduct.Type = event.target.value;
    };

    /**
     * Hander from new product name change.
     *
     * @param event
     */
    const handleProductNameChange = (event: FormEvent<HTMLInputElement>) => {
        newProduct.Name = event.currentTarget.value;
    }

    /**
     * Hander for new product description change.
     *
     * @param event
     */
    const handleProductDescriptionChange = (event: FormEvent<HTMLInputElement>) => {
        newProduct.Description = event.currentTarget.value;
    }

    /**
     * Handler for new product URL change
     *
     * @param event
     */
    const handleProductUrlChange = (event: FormEvent<HTMLInputElement>) => {
        newProduct.Url = event.currentTarget.value;
    }

    /**
     * Handler for thumbnail upload.  Will read the file into a string so that we can pass the data via JSON.
     *
     * @param event
     */
    const handleProductThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event.target.files[0]);
    }


    // Begin Ingredient section
    /**
     * Retrieves the complete list of ingredients from the API.
     * @param input
     */
    const getIngredients = async (): Promise<Ingredient[]> => {
        let resp = apiRequest<Ingredient[]>(HttpMethod.GET, '/Ingredient/all', {});

        resp.then((apiResponse) => {
            let list = new Array();

            apiResponse.forEach((ingredient, index) => {
                list.push({'id': ingredient.id, 'name': ingredient.name})
            });
            setIngredientsList(list);
        });
    }

    /**
     * Handles the ingredient selection change event.
     *
     * @param event
     */
    const handleIngredientSelection = (event: SelectChangeEvent) => {
        setSelectedIngredients([...event.target.value])
    }

    /**
     * Form handler for the Ingredients list save for a new product.
     *
     * @param event
     */
    const handleIngredientsSave = (productID, ingredientsToAdd) => {
        let payload = {
            'productId': productID,
            'attributeIds': ingredientsToAdd
        }

        let response = apiRequest<any>(HttpMethod.POST, '/Product/AddIngredients', {}, payload);
        response.then((apiResponse) => {
            console.log(apiResponse);
            // Close product modal
            setOpenProductForm(false);
        });
        response.catch((apiResponse) => {
            console.log(apiResponse);
        });
    }

    return (
        <>
            <Grid>
                <Grid xs display="flex" justifyContent="right" alignItems="right">
                    <Button variant="contained" onClick={handleOpenProductForm}>Add Product</Button>
                </Grid>
                <Modal
                    open={openProductForm}
                    onClose={handleCloseProductForm}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Add A Product
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <form onSubmit={handleProductSave}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="product-name">Product Name*</InputLabel>
                                    <Input
                                        id="product-name"
                                        name={'Name'}
                                        required={true}
                                        label={'Product Name'}
                                        onChange={handleProductNameChange}
                                    />
                                </FormControl>
                                <FormControl fullWidth className={styles.productFormRow}>
                                    <input
                                        accept="image/*"
                                        id="product-thumbnail"
                                        type="file"
                                        name={'Thumbnail'}
                                        onChange={handleProductThumbnailChange}
                                    />
                                </FormControl>
                                <FormControl fullWidth className={styles.productFormRow}>
                                    <TextField
                                        id="product-description"
                                        name={'Description'}
                                        label={'Product Description'}
                                        required={true}
                                        multiline
                                        rows={4}
                                        onChange={handleProductDescriptionChange}
                                    />
                                </FormControl>
                                <FormControl fullWidth className={styles.productFormRow}>
                                    <InputLabel id="product-type">Type*</InputLabel>
                                    <Select
                                        labelId="product-type"
                                        id="product-type"
                                        label="type"
                                        onChange={handleProductTypeChange}
                                        required={true}
                                    >
                                        {skinTypeSelectData.map((text) => (
                                            <MenuItem
                                                key={text}
                                                value={text.toUpperCase()}
                                            >
                                                {text}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth className={styles.productFormRow}>
                                    <InputLabel htmlFor="product-url">Product URL</InputLabel>
                                    <Input
                                        id="product-url"
                                        name={'Url'}
                                        onChange={handleProductUrlChange}
                                    />
                                </FormControl>
                                <FormControl fullWidth className={styles.productFormRow}>
                                    <InputLabel id="ingredients-select">Ingredients</InputLabel>
                                    <Select
                                        id='ingredient-selection'
                                        multiple
                                        onChange={handleIngredientSelection}
                                        label="Ingredients-select"
                                        inputProps={{
                                            id: 'select-multiple-native',
                                        }}
                                        value={selectedIngredients}
                                    >
                                        {ingredientsList.map(({name, id}) => (
                                            <MenuItem
                                                key={id}
                                                value={id}
                                            >
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Grid xs display="flex" justifyContent="right" alignItems="right">
                                    <Button type={'submit'} variant="contained">Save</Button>
                                </Grid>
                            </form>
                        </Typography>
                    </Box>
                </Modal>
            </Grid>
        </>
    );
}