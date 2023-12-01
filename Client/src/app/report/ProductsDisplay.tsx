import {Product} from "./[id]/page";
import {Typography, Grid, Card, CardContent, CardActionArea} from "@mui/material";

interface ProductDisplayProps {
    products: Product[];
}

const ProductsDisplay: React.FC<ProductDisplayProps> = ({ products }) => {
    return (
        <Grid 
            container 
            direction={"row"}
            alignItems={"baseline"}
            justifyContent={"center"}
            spacing={3}
            sx={{ marginBottom: "20px"}}>
            {products.map((p: Product) => (
                <Grid
                    key={p.id}
                    item
                    xs={4}>
                        <Card sx={{ height: "500px"}}>
                            <CardContent>
                                <CardActionArea href={p.url} target="_blank" style={{ alignItems: "center", justifyContent: "center", display: "flex" }}>
                                    <img src={`https://api.skinformation.site/images/products/${p.id}.png`}/>
                                </CardActionArea>
                                <Typography 
                                    variant={"h6"}>
                                    {p.name}
                                </Typography>
                                <Typography>
                                    {p.description}
                                </Typography>
                            </CardContent>
                        </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default ProductsDisplay;