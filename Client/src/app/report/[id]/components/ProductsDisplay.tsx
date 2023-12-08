import {Card, CardActionArea, CardContent, Grid, Typography} from "@mui/material";
import {Product} from "@/app/shared/types";
import Image from 'next/image'

interface ProductDisplayProps {
    products: Product[];
}

const ProductsDisplay: React.FC<ProductDisplayProps> = ({products}) => {
    return (
        <Grid
            container
            direction={"row"}
            alignItems={"stretch"}
            justifyContent={"center"}
            spacing={3}>
            {products.map((p: Product) => (
                <Grid
                    key={p.id}
                    item
                    lg={4}
                    md={4}
                    xs={12}>
                    <Card sx={{height: "100%"}}>
                        <CardContent>
                            <CardActionArea href={p.url} target="_blank"
                                            style={{alignItems: "center", justifyContent: "center", display: "flex"}}>
                                <Image alt={`Product image for ${p.name}`}
                                       src={`https://api.skinformation.site/images/products/${p.id}.png`}/>
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