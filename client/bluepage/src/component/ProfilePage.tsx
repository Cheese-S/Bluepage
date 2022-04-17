import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material/';
import { ButtonAppBar } from './NavBar';
import { ProfileContentCard } from '../subcomponents/ProfileContentCard';
import { ProfileSubcontentCard } from '../subcomponents/ProfileSubcontentCard';
import { getUserByID } from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import { userStore } from '../store/UserStore';

export default function ProfilePage(){
    const { id } = useParams();
    const state = userStore(); 
    const history = useNavigate();
    const [user,setuser] = React.useState<null | any>(null);
    useEffect(() => {
        const getuser = async () =>{
            const res = await getUserByID(id as string);
            setuser(res.data.user);
            console.log(res.data.user);
            console.log(user);
        }
        getuser();
    },[]);
    const handleresetpasword = () =>{
        var his = `/resetpassword`
        history(his);
    }

    let counter="N/A";
    let name="N/A";
    let email="N/A";  
    let describe="N/A";
    let listpublished; 
    let listunpublished;
    let visb="hidden";
    if(user != null){
        if(user._id==state.id){
            visb="visible";
        }
        console.log("have user");
        counter=user.followers.length; 
        email=user.email;
        name=user.name;
        describe=user.description;
        listpublished=
        <Box style={{overflowX: "auto",display: 'flex', flexDirection: 'row', margin: '16px' }}>
            {
            user.ownComics.filter(function (comic : any) {return comic.published === true;}).map((comic : any) => (
                <ProfileContentCard
                    key={comic._id}
                />
            ))
            }
            {
            user.ownStories.filter(function (story : any) {return story.published === true;}).map((story : any) => (
                <ProfileContentCard
                    key={story._id}
                />
            ))
            }
        </Box>;
        listunpublished=<Box style={{ display: 'flex', flexDirection: 'row', margin: '16px' }}>
        {
            user.ownComics.filter(function (comic : any) {return comic.published === false;}).map((comic : any) => (
                <ProfileContentCard
                    key={comic._id}
                />
            ))
            }
            {
            user.ownStories.filter(function (story : any) {return story.published === false;}).map((story : any) => (
                <ProfileContentCard
                    key={story._id}
                />
            ))
            }
        </Box>;
    }
    else{
        console.log("no user");
    }

    return (
        <Box style={{ backgroundColor: '#3c78d8', alignItems: 'center', justifyContent: 'center' }}>
            <ButtonAppBar/>
            <Box style={{ padding: '20px' }} />
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
                <Box style={{ width: '20%'}}>
                    <Box style={{ display: 'flex', flexDirection: 'column', width: '80%', margin: 'auto' }}>
                        <Box style={{ width: '100%', height: '240px', backgroundColor: '#d25eb2' }}>
                            <Typography style={{ fontWeight: 'bold', fontSize: '80px' }}>{name}</Typography>
                        </Box>
                        <Box style={{ backgroundColor: '#ffffff' }}>
                            <Typography style={{ fontSize: '18px', margin: '10px' }}>{email}</Typography>
                            <Box style={{ display: 'flex', flexDirection: 'row', margin: '10px' }}>
                                <Button variant='contained' style={{ fontSize: '10px', marginRight: '10px' }}>Follow</Button>
                                <Button onClick={handleresetpasword} variant='contained' style={{ fontSize: '10px', marginRight: '10px' }} sx={{ visibility: {visb} }}>Reset Password</Button>
                                {counter}<Typography> followers</Typography>
                            </Box>
                            {describe}
                        </Box>
                    </Box>
                </Box>
                <Box style={{ width: '78%', backgroundColor: '#ffffff'}} sx={{ borderRadius: 4 }}>
                    <Box style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>Published Content</Typography>
                        {listpublished}
                        <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>Unpublished Subcontent</Typography>
                        {listunpublished}
                        <Box style={{ padding: '16px' }}/>
                    </Box>
                </Box>
                <Box style={{ width: '2%'}}/>
            </Box>
            <Box style={{ padding: '16px' }}/>
        </Box>
    );
}

