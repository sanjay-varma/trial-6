import React from "react"
import { useState, useEffect, useCallback } from "react";
import { Alert, Fab, Dialog, DialogTitle, Stack, Box, TextField, Button, List, ListItem, Link, ListItemAvatar, ListItemText, IconButton, Icon, Avatar, Typography, Pagination } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"

export default function UserList(props) {

    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [showUserEdit, setShowUserEdit] = useState(false);
    const [users, setUsers] = useState([]);
    const [selUser, setSelUser] = useState({});

    const getUsers = useCallback(() => {
        fetch("http://localhost:8000/user?page=" + page)
            .then((res) => res.json())
            .then((resJson) => {
                setUsers(resJson.data);
                setPageCount(resJson.pageCount);
            })
    }, [page])

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const showUsers = (user, index) => {
        return (
            <ListItem
                key={user.id}
                secondaryAction={
                    <Box>
                        <IconButton onClick={() => editUserClick(user)} edge="end" aria-label="delete">
                            <Icon>edit</Icon>
                        </IconButton>
                        <IconButton onClick={() => hideUser(index)} edge="end" aria-label="delete">
                            <Icon>clear</Icon>
                        </IconButton>
                        <IconButton onClick={() => delUser(index, user)} edge="end" aria-label="delete">
                            <Icon>delete_forrever</Icon>
                        </IconButton>
                    </Box>
                }>
                <ListItemAvatar>
                    <Avatar src={user.avatar} />
                </ListItemAvatar>
                <ListItemText
                    primary={user.first_name + " " + user.last_name}
                    secondary={<Link href={"mailto:" + user.email} underline="hover">
                        {user.email}
                    </Link>}
                />
            </ListItem>
        )
    }

    const hideUser = (index) => {
        var u = users;
        u.splice(index, 1);
        setUsers(u.slice());
    }

    const delUser = (index, user) => {

        fetch("http://localhost:8000/user", {
            method: "DELETE",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: user.id
            })
        })
            .then(() => {
                hideUser(index);
            })
    }

    const editUserClick = (user) => {
        setShowUserEdit(true);
        setSelUser(user);
    }

    const handleClose = (userData) => {
        setShowUserEdit(false);
        getUsers();
    }

    const handleChange = (event, value) => {
        setPage(value);
        getUsers();
    }

    const addUser = () => {
        setShowUserEdit(true);
        setSelUser({});
    }

    const [userFound, setUserFound] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const checkUsers = (inputString) => {
        setShowMessage(inputString.trim() !== "");
        setUserFound(users.some((user) => {
            return (user.email.search(inputString) >= 0 ||
                user.first_name.search(inputString) >= 0 ||
                user.last_name.search(inputString) >= 0)
        }))
    }

    return (
        <div>
            <Stack>
                <Typography>Page: {page}</Typography>
                <TextField
                    required
                    id="outlined-required"
                    label="Search in page"
                    defaultValue=""
                    onChange={(e) => { checkUsers(e.target.value) }}
                />
                {showMessage &&
                    <Alert severity="info">Match {userFound ? "" : "not"} found</Alert>
                }
            </Stack>


            <List sx={{ width: "60%" }}>
                {users.map(showUsers)}
            </List>
            {users.length < 1 &&
                <Typography>This page is empty ...</Typography>
            }
            <Fab color="primary" aria-label="add">
                <AddIcon onClick={addUser} />
            </Fab>
            <Pagination count={pageCount} page={page} onChange={handleChange} />
            <Button onClick={getUsers}>Refresh</Button>
            <UserUpdate
                userData={selUser}
                open={showUserEdit}
                onClose={handleClose} />
        </div >
    )

}


function UserUpdate(props) {

    const open = props.open;
    const userData = props.userData;
    const onClose = props.onClose;

    const handleClose = (value) => {
        onClose(userData);
    };

    const saveData = () => {
        userData.id = props.userData.id;
        if (!userData.email) userData.email = props.userData.email;
        if (!userData.first_name) userData.first_name = props.userData.first_name;
        if (!userData.last_name) userData.last_name = props.userData.last_name;
        if (!userData.avatar) userData.avatar = (props.userData.avatar ? props.userData.avatar : '');
        fetch("http://localhost:8000/user", {
            method: userData.id ? "POST" : "PUT",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: userData.id,
                email: userData.email.trim(),
                first_name: userData.first_name.trim(),
                last_name: userData.last_name.trim(),
                avatar: userData.avatar.trim()
            })
        })
            .then((res) => res.json())
            .then((resJS) => {
                handleClose(userData);
            })
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{('id' in props.userData) ? 'Edit' : 'New'} User Data</DialogTitle>
            <Stack sx={{ width: "100%" }}>
                <TextField
                    required
                    id="outlined-required"
                    label="Email"
                    defaultValue={props.userData.email}
                    onChange={(e) => { userData.email = e.target.value }}
                />
                <TextField
                    id="outlined-required"
                    label="First Name"
                    defaultValue={props.userData.first_name}
                    onChange={(e) => { userData.first_name = e.target.value }}
                />
                <TextField
                    id="outlined-required"
                    label="Last Name"
                    defaultValue={props.userData.last_name}
                    onChange={(e) => { userData.last_name = e.target.value }}
                />
                <Button onClick={saveData}>Save</Button>
            </Stack>
        </Dialog>
    );
}
