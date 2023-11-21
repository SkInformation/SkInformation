import {useState} from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {Product, useSurvey} from "@/app/context/SurveyContext";
import SearchBar from '@/app/components/SearchBar'
import LinkIcon from '@mui/icons-material/Link';
import {
    Collapse,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import * as url from "url";
import Box from "@mui/material/Box";

const searchProduct = async (input: string): Promise<Product[]> => {
    //return apiRequest<Product[]>(HttpMethod.GET, '/Product/Search', { term: input })

    return [
        {
            "id": 2,
            "name": "Hydrating Foaming Oil Cleanser",
            "description": "Lightweight cleansing oil for face and body",
            "type": "CLEANSER",
            "url": "https://cerave.com/skincare/cleansers/facial-cleansers/hydrating-foaming-oil-cleanser",
            "thumbnail": "/images/products/2.png",
            "ingredients": [],
        },
        {
            "id": 4,
            "name": "Hydrating Facial Cleanser",
            "description": "Hydrating cleanser for normal-to-dry skin",
            "type": "CLEANSER",
            "url": "https://cerave.com/skincare/cleansers/hydrating-facial-cleanser",
            "thumbnail": "/images/products/4.png",
            "ingredients": [],
        },
        {
            "id": 5,
            "name": "Hydrating Cream-to-Foam Cleanser",
            "description": "Creamy foaming face wash for normal-to-dry skin",
            "type": "CLEANSER",
            "url": "https://cerave.com/skincare/cleansers/hydrating-cream-to-foam-cleanser",
            "thumbnail": "/images/products/5.png",
            "ingredients": [],
        },
        {
            "id": 7,
            "name": "Acne Control Cleanser",
            "description": "Gel-to-foam salicylic acid acne face wash",
            "type": "CLEANSER",
            "url": "https://cerave.com/skincare/cleansers/acne-salicylic-acid-cleanser",
            "thumbnail": "/images/products/7.png",
            "ingredients": [],
        },
        {
            "id": 10,
            "name": "Comforting Eye Makeup Remover",
            "description": "Gentle eye makeup remover that comforts skin",
            "type": "CLEANSER",
            "url": "https://cerave.com/skincare/cleansers/comforting-eye-makeup-remover",
            "thumbnail": "/images/products/10.png",
            "ingredients": [],
        },
        {
            "id": 11,
            "name": "Hydrating Makeup Removing Plant-Based Wipes",
            "description": "Makeup removing compostable wipes",
            "type": "CLEANSER",
            "url": "https://cerave.com/skincare/cleansers/hydrating-makeup-removing-plant-based-wipes",
            "thumbnail": "/images/products/11.png",
            "ingredients": [],
        },
        {
            "id": 12,
            "name": "Makeup Removing Cleanser Cloths",
            "description": "Makeup remover cloth and gentle cleanser",
            "type": "CLEANSER",
            "url": "https://cerave.com/skincare/cleansers/makeup-removing-cleanser-cloths",
            "thumbnail": "/images/products/12.png",
            "ingredients": [],
        },
        {
            "id": 13,
            "name": "Ultra-Light Moisturizing Gel",
            "description": "Refreshing, lightweight texture with a weightless feel on skin",
            "type": "MOISTURIZER",
            "url": "https://cerave.com/skincare/moisturizers/facial-moisturizers/ultra-light-gel-moisturizer",
            "thumbnail": "/images/products/13.png",
            "ingredients": [],
        }
    ]
}

export default function Products() {
    const {products, setProducts} = useSurvey()

    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState<Product | null>(null)

    const addProduct = (value: Product) => {
        if (products.find(p => p.id === value.id)) {
            return
        }
        setProducts([...products, value])
    }

    return (
        <>
            <Grid container alignContent={"space-evenly"} disableEqualOverflow>
                <Grid display="flex" xs={12}>
                    <SearchBar name="product" selectedValue={products} setSelectedValue={addProduct}
                               query={searchProduct}/>
                </Grid>
                <Grid display="flex" flexGrow={1}>
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} stickyHeader size="small" width="100%" aria-label="products table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => {
                                    const thumbnailUrl = url.resolve(process.env.NEXT_PUBLIC_API_URL ?? '', product.thumbnail)

                                    return (
                                        <>
                                            <TableRow
                                                key={`product-${product.id}`}
                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                onClick={() => setOpen(!open)}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <Stack direction="row" spacing={1} alignItems="center"
                                                           textAlign="center">
                                                        <a href={thumbnailUrl} target="_blank">
                                                            <img
                                                                width={75}
                                                                height={75}
                                                                src={thumbnailUrl}
                                                                alt={product.description}/>
                                                        </a>
                                                        <Typography
                                                            className="MuiTypography-alignMiddle">{product.name}</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <Typography>
                                                        {product.type}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <Typography>
                                                        {product.description}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        style={{
                                                            borderRadius: "50%",
                                                            backgroundColor: "transparent"
                                                        }}
                                                        aria-label={`${product.name} link`}
                                                        onClick={() => {
                                                            window.open(product.url, '_blank');
                                                        }}
                                                    >
                                                        <LinkIcon/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow key={`product-${product.id}-ingredients`}>
                                                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                                        <Box sx={{margin: 1}}>
                                                            <Typography variant="h6" gutterBottom component="div">
                                                                Ingredients
                                                            </Typography>
                                                            <Table size="small" aria-label="ingredients-table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Name</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableRow>
                                                                        <TableCell>Test Ingredient</TableCell>
                                                                    </TableRow>
                                                                    {/*{product.ingredients.map((ingredient) => (*/}
                                                                    {/*    <TableRow key={historyRow.date}>*/}
                                                                    {/*        <TableCell component="th" scope="row">*/}
                                                                    {/*            {historyRow.date}*/}
                                                                    {/*        </TableCell>*/}
                                                                    {/*        <TableCell>{historyRow.customerId}</TableCell>*/}
                                                                    {/*        <TableCell align="right">{historyRow.amount}</TableCell>*/}
                                                                    {/*        <TableCell align="right">*/}
                                                                    {/*            {Math.round(historyRow.amount * row.price * 100) / 100}*/}
                                                                    {/*        </TableCell>*/}
                                                                    {/*    </TableRow>*/}
                                                                    {/*))}*/}
                                                                </TableBody>
                                                            </Table>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    );
}


// useEffect(() => {
//     setProducts([
//         {
//             "id": 2,
//             "name": "Hydrating Foaming Oil Cleanser",
//             "description": "Lightweight cleansing oil for face and body",
//             "type": "CLEANSER",
//             "url": "https://cerave.com/skincare/cleansers/facial-cleansers/hydrating-foaming-oil-cleanser",
//             "thumbnail": "/images/products/2.png",
//             "ingredients": [],
//         },
//         {
//             "id": 4,
//             "name": "Hydrating Facial Cleanser",
//             "description": "Hydrating cleanser for normal-to-dry skin",
//             "type": "CLEANSER",
//             "url": "https://cerave.com/skincare/cleansers/hydrating-facial-cleanser",
//             "thumbnail": "/images/products/4.png",
//             "ingredients": [],
//         },
//         {
//             "id": 5,
//             "name": "Hydrating Cream-to-Foam Cleanser",
//             "description": "Creamy foaming face wash for normal-to-dry skin",
//             "type": "CLEANSER",
//             "url": "https://cerave.com/skincare/cleansers/hydrating-cream-to-foam-cleanser",
//             "thumbnail": "/images/products/5.png",
//             "ingredients": [],
//         },
//         {
//             "id": 7,
//             "name": "Acne Control Cleanser",
//             "description": "Gel-to-foam salicylic acid acne face wash",
//             "type": "CLEANSER",
//             "url": "https://cerave.com/skincare/cleansers/acne-salicylic-acid-cleanser",
//             "thumbnail": "/images/products/7.png",
//             "ingredients": [],
//         },
//         {
//             "id": 10,
//             "name": "Comforting Eye Makeup Remover",
//             "description": "Gentle eye makeup remover that comforts skin",
//             "type": "CLEANSER",
//             "url": "https://cerave.com/skincare/cleansers/comforting-eye-makeup-remover",
//             "thumbnail": "/images/products/10.png",
//             "ingredients": [],
//         },
//         {
//             "id": 11,
//             "name": "Hydrating Makeup Removing Plant-Based Wipes",
//             "description": "Makeup removing compostable wipes",
//             "type": "CLEANSER",
//             "url": "https://cerave.com/skincare/cleansers/hydrating-makeup-removing-plant-based-wipes",
//             "thumbnail": "/images/products/11.png",
//             "ingredients": [],
//         },
//         {
//             "id": 12,
//             "name": "Makeup Removing Cleanser Cloths",
//             "description": "Makeup remover cloth and gentle cleanser",
//             "type": "CLEANSER",
//             "url": "https://cerave.com/skincare/cleansers/makeup-removing-cleanser-cloths",
//             "thumbnail": "/images/products/12.png",
//             "ingredients": [],
//         },
//         {
//             "id": 13,
//             "name": "Ultra-Light Moisturizing Gel",
//             "description": "Refreshing, lightweight texture with a weightless feel on skin",
//             "type": "MOISTURIZER",
//             "url": "https://cerave.com/skincare/moisturizers/facial-moisturizers/ultra-light-gel-moisturizer",
//             "thumbnail": "/images/products/13.png",
//             "ingredients": [],
//         }
//     ])
// }, [])