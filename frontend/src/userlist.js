import React from "react"
import { useState, useEffect, useCallback } from "react";
import { MenuItem, InputLabel, FormControl, Select, Alert, Fab, Dialog, DialogTitle, Stack, Box, TextField, Button, List, ListItem, Link, ListItemAvatar, ListItemText, IconButton, Icon, Avatar, Typography, Pagination } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"

export default function UserList(props) {

    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [showUserEdit, setShowUserEdit] = useState(false);
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selUser, setSelUser] = useState({});

    const getUsers = useCallback(() => {
        fetch("/api/user?page=" + page)
            .then((res) => res.json())
            .then((resJson) => {
                setPageCount(resJson.pageCount);
                setUsers(resJson.data);
            })
        fetch("/api/group")
            .then((res) => res.json())
            .then((resJson) => {
                setGroups(resJson.data);
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
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="green"
                            >
                                {user.group.name}
                            </Typography>
                            <Link
                                sx={{ 'margin-left': '5px' }}
                                href={"mailto:" + user.email}
                                underline="hover">
                                {user.email}
                            </Link>
                        </React.Fragment>
                    }
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

        fetch("/api/user", {
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
                groups={groups}
                open={showUserEdit}
                onClose={handleClose} />
        </div >
    )

}


function UserUpdate(props) {

    const open = props.open

    const [user, setUser] = useState({});
    const userData = {};

    useEffect(() => {
        userData.id = props.userData.id;
        userData.email = props.userData.email;
        userData.first_name = props.userData.first_name;
        userData.last_name = props.userData.last_name;
        userData.group_id = props.userData.group_id;
        userData.group = props.groups.find(g => g.id == props.userData.group_id);
        setUser(userData);
    })

    const groups = props.groups;
    const onClose = props.onClose;

    const handleClose = (value) => {
        onClose(userData);
    };

    const saveData = () => {
        userData.id = user.id;
        userData.group_id = user.group_id;
        userData.email = user.email.trim();
        userData.first_name = user.first_name.trim();
        userData.last_name = user.last_name.trim();
        userData.avatar = user.avatar ? user.avatar.trim() : '';
        userData.group = user.group;
        console.log("saveData ", userData);

        fetch("/api/user", {
            method: userData.id ? "POST" : "PUT",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
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
                    defaultValue={user.email}
                    onChange={(e) => { userData.email = e.target.value; setUser(userData) }}
                />
                <TextField
                    id="outlined-required"
                    label="First Name"
                    defaultValue={user.first_name}
                    onChange={(e) => { userData.first_name = e.target.value; setUser(userData) }}
                />
                <TextField
                    id="outlined-required"
                    label="Last Name"
                    defaultValue={user.last_name}
                    onChange={(e) => { userData.last_name = e.target.value; setUser(userData) }}
                />
                <FormControl fullWidth>
                    <InputLabel id="select-group-label">Group</InputLabel>
                    <Select
                        labelId="select-group-label"
                        id="select-group"
                        value={user.group_id}
                        label="Group"
                        onChange={(e) => {
                            userData.group_id = e.target.value;
                            userData.group = groups.find(g => g.id == userData.group_id);
                            setUser(userData)
                        }}
                    >
                        {groups.map((g) => {
                            return <MenuItem value={g.id}>{g.name}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                <Button onClick={saveData}>Save</Button>
            </Stack>
        </Dialog>
    );
}
