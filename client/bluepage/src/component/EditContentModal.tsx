import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";

export default function FormDialog() {
    const [open, setOpen] = React.useState(false);

    const [tagState, setState] = React.useState({
        "Action": false,
        "Romance": false,
        "Mystery": false,
        "Fantasy": false,
        "Historical": false,
        "Comedy": false,
        "Fanwork": false,
        "Sci_Fi": false,
        "Thriller": false,
        "Psychological": false
    });

    const [chapterState, setChapterState] = React.useState({
        "newChapter": false
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setState({
            ...tagState,
            [event.target.name]: event.target.checked
        });
    };
    const handleChapterChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setChapterState({
            ...chapterState,
            [event.target.name]: event.target.checked
        });
    };

    const error = Object.values(tagState).filter((e) => !!e).length < 1;
    const chapterError = Object.values(chapterState).filter((e) => !!e).length < 1;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const tags = [
        "Action",
        "Romance",
        "Mystery",
        "Fantasy",
        "Historical",
        "Comedy",
        "Fanwork",
        "Sci_Fi",
        "Thriller",
        "Psychological"
    ];

    const newChapters = Object.keys(chapterState)

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Open form dialog
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="xl">
                <DialogTitle>Edit</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here.
                        We will send updates occasionally.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Title"
                        type="title"
                        fullWidth
                        variant="standard"
                        defaultValue="To Kill a Mockingbird"
                    />
                    <TextField
                        multiline
                        margin="dense"
                        id="name"
                        label="Description"
                        type="description"
                        fullWidth
                        variant="standard"
                        defaultValue="To Kill a Mockingbird"
                    />
                    <FormControl
                        required
                        error={error}
                        component="fieldset"
                        sx={{ my: 1 }}
                        variant="standard"
                    >
                        <FormLabel>Tags</FormLabel>
                        <FormGroup row>
                            {tags.map((tag) => {
                                return (
                                    <FormControlLabel
                                        sx={{ width: 1 / 7 }}
                                        control={
                                            <Checkbox
                                                //@ts-ignore
                                                checked={tagState[`${tag}`]}
                                                onChange={handleChange}
                                                name={tag}
                                            />
                                        }
                                        label={tag}
                                    />
                                );
                            })}
                        </FormGroup>
                        <FormHelperText>You must choose at least 1</FormHelperText>
                    </FormControl>
                    <FormControl
                        required
                        error={chapterError}
                        component="fieldset"
                        sx={{ my: 1 }}
                        variant="standard"
                    >
                        <FormLabel>Unpublished Chapter</FormLabel>
                        <FormGroup row>
                            {newChapters.map((c) => {
                                return (
                                    <FormControlLabel
                                        sx={{ width: 1 / 7 }}
                                        control={
                                            <Checkbox
                                                //@ts-ignore
                                                checked={chapterState[`${c}`]}
                                                onChange={handleChapterChange}
                                                name={c}
                                            />
                                        }
                                        label={c}
                                    />
                                );
                            })}
                        </FormGroup>
                        <FormHelperText>You must choose at least 1</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
