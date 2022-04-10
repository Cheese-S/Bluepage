import React from "react"
import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material/';

const cardData = {
    title: "To Kill a Mockingbird",
    views: 100,
    followers: 10000,
    author: "Harper Lee",
    tags: ['Romance', 'Sci-Fi']
}


const getFormattedNum = (num: number): string => {
    if (num > 1000000000)
        return `${(num / 1000000000).toFixed(2)}B`
    if (num > 1000000)
        return `${(num / 1000000).toFixed(2)}M`
    if (num > 1000)
        return `${(num / 1000).toFixed(2)}K`

    return num.toString();
}

export const ProfileSubcontentCard: React.FC = ({ }) => {

    return (
        <Card sx={{ display: "flex", width: 300, marginRight: '16px' }}>
            <Box style={{ display: 'flex', flexDirection: 'column'}}>
                <CardMedia
                    component="img"
                    sx={{ width: 300 }}
                    image="https://manga.guya.moe/media/manga/Oshi-no-Ko/chapters/0057_smb1803j/5/18_w.png"
                    alt="Live from space album cover"
                />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                        <Typography sx={{ fontWeight: "bold" }} component="div" variant="h5">
                            Do not open still WIP
                        </Typography>
                        <Button variant='contained'>Publish</Button>
                    </CardContent>
                </Box>
            </Box>
        </Card>
    )
}