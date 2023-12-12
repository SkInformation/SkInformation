import {Card, CardActionArea, CardContent, Grid, Typography} from "@mui/material";
import {Product} from "@/app/shared/types";
import Image from 'next/image'
import url from "url";

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
            {products.map((p: Product) => {
                const thumbnailUrl = url.resolve(process.env.NEXT_PUBLIC_API_URL ?? '', p.thumbnail)
                return (
                    <Grid
                        key={p.id}
                        item
                        lg={4}
                        md={4}
                        xs={12}>
                        <Card sx={{height: "100%"}}>
                            <CardContent>
                                <CardActionArea href={p.url} target="_blank"
                                                style={{
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    display: "flex"
                                                }}>
                                    <Image alt={`Product image for ${p.name}`}
                                           width={250}
                                           height={250}
                                           src={thumbnailUrl}/>
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
                )
            })}
        </Grid>
    );
}

export default ProductsDisplay;