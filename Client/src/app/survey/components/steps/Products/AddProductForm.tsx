import {ChangeEvent, FormEvent, SetStateAction, useEffect, useState} from "react";
import {apiRequest, HttpMethod, submitMultipartForm} from "@/app/lib/api"
import {
    Alert,
    AlertTitle,
    Button,
    Collapse,
    FormControl,
    IconButton,
    Input,
    InputLabel,
    MenuItem,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Box from "@mui/material/Box";
import {Ingredient} from "@/app/shared/types";
import Grid from "@mui/material/Unstable_Grid2";
import styles from '@/app/survey/page.module.css'
import CloseIcon from '@mui/icons-material/Close';

export default function AddProductForm() {
    const [openProductForm, setOpenProductForm] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
    const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
    const [successBox, setSuccessBoxStatus] = useState(false);
    const [errorBox, setErrorBoxStatus] = useState(false);

    //Properties
    const [productId, setProductId] = useState<Number>(0);
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productThumbnail, setProductThumbnail] = useState<File | null>(null);
    const [productType, setProductType] = useState("");
    const [productUrl, setProductUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState<String | null>(null)

    useEffect(() => {
        if(ingredientsList.length == 0) {
            getIngredients();
        }
    }, [ingredientsList])

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
        paddingRight: 6,
    };

    const skinTypeSelectData = [
        'Cleanser',
        'Moisturizer',
        'Serum',
        'Sunscreen'
    ]

    interface ProductCreateResponse {
        id: Number
    }

    interface IngredientResponse {
        status: String
    }

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
        formData.append('name', productName);
        formData.append('description', productDescription);
        formData.append('type', productType);
        formData.append('url', productUrl);

        if (productThumbnail) {
            formData.append('thumbnail', productThumbnail, productThumbnail.name);
        }

        try {
            const response = await submitMultipartForm<ProductCreateResponse>(formData, '/Product/Create');

            // Handle response form API.
            if (response.id) {
                setProductId(response.id);
                handleIngredientsSave(response.id);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorBoxStatus(true);
        }

    }

    /**
     * Form handler for the Ingredients list save for a new product.
     *
     * @param event
     */
    const handleIngredientsSave = (productID: Number) => {

        let response = apiRequest<IngredientResponse>(HttpMethod.POST, '/Product/AddIngredients', {'productId': productID}, selectedIngredients);

        response.then((apiResponse) => {
            if(apiResponse.status == 'success') {
                // Close product modal
                setOpenProductForm(false);
                setSuccessBoxStatus(true);
            }
        });
        response.catch((apiResponse) => {
            console.log('Error: ' + apiResponse);
            setErrorBoxStatus(true);
        });
    }

    /**
     * Handler for new product type selection
     *
     * @param event
     */
    const handleProductTypeChange = (event: SelectChangeEvent) => {
        setProductType(event.target.value)
    }

    /**
     * Hander from new product name change.
     *
     * @param event
     */
    const handleProductNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setProductName(event.currentTarget.value)
    }

    /**
     * Hander for new product description change.
     *
     * @param event
     */
    const handleProductDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
        setProductDescription(event.currentTarget.value)
    }

    /**
     * Handler for new product URL change
     *
     * @param event
     */
    const handleProductUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        const urlRegex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');

        if (urlRegex.test(event.currentTarget.value)) {
            setErrorMessage(null);
            setProductUrl(event.currentTarget.value)
        } else {
            setErrorMessage('Is Not Valid URL')
        }
    }

    /**
     * Handler for thumbnail upload.  Will read the file into a string so that we can pass the data via JSON.
     *
     * @param event
     */
    const handleProductThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setProductThumbnail(event.target.files[0]);
        }
    }


    // Begin Ingredient section
    /**
     * Retrieves the complete list of ingredients from the API.
     * @param input
     */
    const getIngredients = (): Promise<Ingredient[]> => {
        return apiRequest<Ingredient[]>(HttpMethod.GET, '/Ingredient/all', {}).then((response) => {
            let list: Ingredient[] = [];
            response.forEach((ingredient, index) => {
                list.push(ingredient)
            });
            setIngredientsList(list);
            return list;
        });
    }

    /**
     * Handles the ingredient selection change event.
     *
     * @param event
     */
    const handleIngredientSelection = (event: SelectChangeEvent<number[]>) => {
        setSelectedIngredients(event.target.value as SetStateAction<number[]>)
    }

    return (
        <>
            <Grid>
                <Box sx={{ width: '100%' }}>
                    <Collapse in={successBox}>
                        <Alert
                            severity="success"
                            action={
                                <IconButton
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setSuccessBoxStatus(false);
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            <AlertTitle>Success</AlertTitle>
                            The product was saved!
                        </Alert>
                    </Collapse>
                    <Collapse in={errorBox}>
                        <Alert
                            severity="error"
                            action={
                                <IconButton
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setErrorBoxStatus(false);
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            <AlertTitle>Error</AlertTitle>
                            This is an error in saving your product
                        </Alert>
                    </Collapse>
                </Box>
                <Grid xs display="flex" justifyContent="right" alignItems="right" className={styles.addProductButtonRow}>
                    <Button variant="contained" onClick={handleOpenProductForm}>Add Product</Button>
                </Grid>
                <Modal
                    open={openProductForm}
                    onClose={handleCloseProductForm}
                    aria-labelledby="add-product-modal"
                    aria-describedby="add-product-modal"
                >
                    <Box sx={style}>
                        <Box sx={{ width: '100%' }}>
                            <Collapse in={errorMessage !== null}>
                                <Alert
                                    severity="error"
                                    action={
                                        <IconButton
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setErrorMessage(null);
                                            }}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                >
                                    <AlertTitle>Error</AlertTitle>
                                    {errorMessage}
                                </Alert>
                            </Collapse>
                        </Box>
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
                                        // label={"Product Name"}
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
                                        defaultValue=""
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
                                        required={true}
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