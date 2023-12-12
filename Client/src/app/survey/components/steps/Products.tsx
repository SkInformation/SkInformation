import {useState} from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {useSurvey} from "@/app/context/SurveyContext";
import apiRequest, {HttpMethod} from "@/app/lib/api"
import SearchBar from '@/app/components/SearchBar'
import FlakyIcon from '@mui/icons-material/Flaky';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddProductForm from "@/app/survey/components/steps/Products/AddProductForm";
import {
    Chip,
    Collapse,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import * as url from "url";
import Box from "@mui/material/Box";
import {Product, Reaction} from "@/app/shared/types";
import Image from 'next/image'

const searchProduct = async (input: string): Promise<Product[]> => {
    if (!input) {
        return []
    }

    return apiRequest<Product[]>(HttpMethod.GET, '/Product/Search', {term: input})
}

export default function Products() {
    const {products, setProducts} = useSurvey();
    const [openProduct, setOpenProduct] = useState<number | null>(null);

    const addProduct = (value: Product) => {
        if (products[value.id]) {
            return
        }
        setProducts((previousProducts) => {
            const productsCopy = {...previousProducts}
            productsCopy[value.id] = value

            return productsCopy
        })
    }

    const handleReactionClick = (productId: number, reactionKey: string) => {
        if (!products[productId]) {
            console.error(`Product not found ${productId}`)
            return
        }

        const updatedProducts = {...products};

        // Find the product by ID
        const product = updatedProducts[productId];

        if (product) {
            const selectedReaction = Reaction[reactionKey as keyof typeof Reaction];

            let reactions = [...(product.reactions || [])];
            // Toggle the reaction
            if (reactions.includes(selectedReaction)) {
                // If selected, remove it from the array
                reactions = reactions.filter(
                    (prevReaction) => prevReaction !== selectedReaction
                );
            } else {
                // If not selected, add it to the array
                reactions = [...reactions, selectedReaction];
            }

            // Update the product in the copied object
            updatedProducts[productId].reactions = reactions;
            setProducts(updatedProducts);
        }
    };

    const handleRowClick = (productId: number) => {
        setOpenProduct((currentProduct) => currentProduct === productId ? null : productId)
    }

    return (
        <>
            <AddProductForm aria-label="Add a new product form"/>
            <Grid container alignContent={"space-evenly"} disableEqualOverflow>
                <Grid display="flex" xs={12}>
                    <Typography variant="body1">
                        <strong>Welcome to the Product Selection Page!</strong>
                    </Typography>
                </Grid>
                <Grid display="flex" xs={12}>
                    <Typography variant="body1">
                        To get started, use the search bar below to find products you&apos;ve used.
                    </Typography>
                </Grid>
                <Grid display="flex" xs={12}>
                    <SearchBar<Product> name="product"
                                        selectedValues={Object.values(products)}
                                        setSelectedValue={addProduct}
                                        query={searchProduct}
                                        aria-label="Search bar for products"/>
                </Grid>
                <Grid display="flex">
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} stickyHeader size="small" width="100%" aria-label="products table">
                            <TableBody>
                                {Object.values(products).map((product) => {
                                    const thumbnailUrl = url.resolve(process.env.NEXT_PUBLIC_API_URL ?? '', product.thumbnail)

                                    return (
                                        <div key={`product-${product.id}`}
                                             onClick={() => handleRowClick(product.id)}
                                             aria-label={`Toggle detailed view for ${product.name}`}>
                                            <TableRow sx={{'&:last-child td, &:last-child th': {borderBottom: 0}}}>
                                                <TableCell>
                                                    <Image
                                                        style={{
                                                            minWidth: '75px',
                                                            minHeight: '75px',
                                                        }}
                                                        height={150}
                                                        width={150}
                                                        src={thumbnailUrl} alt={product.description}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(product.url, '_blank');
                                                        }}
                                                        aria-label={`Open ${product.name} in new tab`}
                                                    />
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <Stack direction="column" spacing={1} alignItems="center"
                                                           textAlign="center">
                                                        <Typography variant="h5">{product.name}</Typography>
                                                        <Typography variant="caption"
                                                                    color="textSecondary">{product.description}</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <Typography>{product.type}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1}>
                                                        {
                                                            Object.keys(Reaction).filter(key => isNaN(Number(key))).map((reaction, index) => (
                                                                <IconButton
                                                                    key={reaction}
                                                                    style={{
                                                                        borderRadius: '50%',
                                                                        backgroundColor: 'transparent',
                                                                        color: (product.reactions || []).includes(Reaction[reaction as keyof typeof Reaction])
                                                                            ? "red"
                                                                            : "gray",
                                                                    }}
                                                                    aria-label={`${product.name} reaction ${index}`}
                                                                    // Handle click event for each reaction button
                                                                    onClick={(e) => {
                                                                        // prevent button click from expanding the ingredient list
                                                                        e.stopPropagation()
                                                                        handleReactionClick(product.id, reaction)
                                                                    }}
                                                                >
                                                                    <FlakyIcon/>
                                                                </IconButton>
                                                            ))
                                                        }
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow key={`product-${product.id}-ingredients`}
                                                      sx={{'&:last-child td, &:last-child th': {borderBottom: 0}}}>
                                                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                                                    <Collapse in={openProduct === product.id} timeout="auto"
                                                              unmountOnExit style={{maxHeight: "600px"}}>
                                                        <Box sx={{margin: 1}}>
                                                            <Typography variant="h6" gutterBottom component="div">
                                                                Ingredients
                                                            </Typography>
                                                            <Table size="small" aria-label="ingredients-table">
                                                                <TableBody>
                                                                    {(product.ingredients || []).map((ingredient) => (
                                                                        <TableRow
                                                                            key={`${ingredient.id}-${ingredient.name}`}>
                                                                            <TableCell>
                                                                                <Tooltip title={ingredient.usage} arrow>
                                                                                    <span>{ingredient.name}</span>
                                                                                </Tooltip>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {ingredient.eyeIrritant &&
                                                                                    <Chip label="Eye Irritant"
                                                                                          aria-label="Eye Irritant"
                                                                                          color="primary"/>}
                                                                                {ingredient.driesSkin &&
                                                                                    <Chip label="Dries Skin"
                                                                                          aria-label="Dries Skin"
                                                                                          color="primary"/>}
                                                                                {ingredient.reducesRedness &&
                                                                                    <Chip label="Reduces Redness"
                                                                                          aria-label="Reduces Redness"
                                                                                          color="primary"/>}
                                                                                {ingredient.hydrating &&
                                                                                    <Chip label="Hydrating"
                                                                                          aria-label="Hydrating"
                                                                                          color="primary"/>}
                                                                                {ingredient.nonComedogenic &&
                                                                                    <Chip label="Non-Comedogenic"
                                                                                          aria-label="Non-Comedogenic"
                                                                                          color="primary"/>}
                                                                                {ingredient.safeForPregnancy &&
                                                                                    <Chip label="Safe for Pregnancy"
                                                                                          aria-label="Safe for Pregnancy"
                                                                                          color="primary"/>}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow key={`product-${product.id}-icon`}
                                                      sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                                <TableCell
                                                    style={{paddingBottom: 0, paddingTop: 0, textAlign: 'center'}}
                                                    colSpan={12}>
                                                    {openProduct === product.id ?
                                                        <ExpandLessIcon fontSize="medium"/> :
                                                        <ExpandMoreIcon fontSize="medium"/>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        </div>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                {
                    Object.values(products).length > 0 ? <></>
                        : <Grid display="flex" xs={12} justifyContent="center">
                            <Typography variant={"caption"} component="div">No products selected.</Typography>
                        </Grid>
                }

            </Grid>
        </>
    );
}
