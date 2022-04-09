import React from "react"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

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

export const SearchViewCard: React.FC = ({ }) => {

    return (
        <Card sx={{ display: "flex" }}>
            <CardMedia
                component="img"
                sx={{ width: 300 }}
                image="/static/images/cards/live-from-space.jpg"
                alt="Live from space album cover"
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography sx={{ fontWeight: "bold" }} component="div" variant="h5">
                        Kill the Mockingbird
                    </Typography>
                    <Typography sx={{ marginY: '1em' }} variant="body1" color="text" component="div">
                        The novel depicts first-person narrator Nick Carraway's interactions
                        with mysterious millionaire Jay Gatsby and Gatsby's obsession to
                        reunite with his former lover, Daisy Buchanan.
                    </Typography>

                    <Typography variant="body1" color="text.secondary" component="div">
                        200k views · 200k Followers
                    </Typography>

                    <Typography variant="body1" color="text.secondary" component="div" >
                        Harper Lee
                    </Typography>
                    {cardData.tags.forEach((tag) =>
                        <Chip
                            key={tag}
                            label={tag}
                            color="primary"
                            size="small"
                        />)}
                    <Typography sx={{ marginTop: '1em' }} variant="body2" color="text.secondary" component="div">
                        Updated At: 3 Months Ago
                    </Typography>
                </CardContent>
            </Box>
        </Card>
    )
}