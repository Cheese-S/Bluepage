import React from "react"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Chip from '@mui/material/Chip'
import * as moment from 'moment'

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

export const ViewCard: React.FC = ({ }) => {

    return (
        <Card sx={{ width: 1 / 4 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image="/static/images/cards/contemplative-reptile.jpg"
                    alt="green iguana"
                />
                <CardContent>
                    <Typography sx={{fontWeight: "bold"}} gutterBottom variant="h5">
                        {cardData.title}
                    </Typography>
                    <Typography variant="body1" color="text">
                        Views: {getFormattedNum(cardData.views)}
                    </Typography>
                    <Typography variant="body1" color="text">
                        Followers: {getFormattedNum(cardData.followers)}
                    </Typography>
                    <Typography variant="body1" color="text">
                        {cardData.author}
                    </Typography>
                    {cardData.tags.forEach((tag) =>
                        <Chip
                            key={tag}
                            label={tag}
                            color="primary"
                            size="small"
                        />)}
                    <Typography variant="body2" color="text.secondary" display="block">
                        Updated At: 3 Mins Ago
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}