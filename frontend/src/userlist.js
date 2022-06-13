import React from "react"
import { Fab, Dialog, DialogTitle, Stack, Box, TextField, Button, List, ListItem, Link, ListItemAvatar, ListItemText, IconButton, Icon, Avatar, Typography, Pagination } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"
export default class UserList extends React.Component {

    constructor(props) {
        super(props);

        this.state = { users: [], page: 1, showUserEdit: false, selUser: {} }
    }

    componentDidMount = () => {
        this.getUsers();
    }

    getUsers = () => {
        fetch("http://localhost:8000/user?page=" + this.state.page)
            .then((res) => res.json())
            .then((resJson) => {
                this.setState({
                    users: resJson.data
                })
            })
    }

    showUsers = (user, index) => {
        return (
            <ListItem
                key={user.id}
                secondaryAction={
                    <Box>
                        <IconButton onClick={() => this.editUserClick(user)} edge="end" aria-label="delete">
                            <Icon>edit</Icon>
                        </IconButton>
                        <IconButton onClick={() => this.hideUser(index)} edge="end" aria-label="delete">
                            <Icon>clear</Icon>
                        </IconButton>
                        <IconButton onClick={() => this.delUser(index, user)} edge="end" aria-label="delete">
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

    hideUser = (index) => {
        var u = this.state.users;
        u.splice(index, 1);
        this.setState({ users: u });
    }

    delUser = (index, user) => {

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
                this.hideUser(index);
            })
    }

    editUserClick = (user) => {
        this.setState({ showUserEdit: true, selUser: user })
    }

    handleClose = (userData) => {
        this.setState({ showUserEdit: false })
        this.getUsers();
    }

    handleChange = (event, value) => {
        this.setState({ page: value }, () => { this.getUsers(); })
    }

    addUser = () => {
        this.setState({ showUserEdit: true, selUser: {} })
    }

    render() {

        return (
            <div>

                <Typography>Page: {this.state.page}</Typography>

                <List sx={{ width: "60%" }}>
                    {this.state.users.map(this.showUsers)}
                </List>
                {this.state.users.length < 1 &&
                    <Typography>This page is empty ...</Typography>
                }
                <Fab color="primary" aria-label="add">
                    <AddIcon onClick={this.addUser} />
                </Fab>
                <Pagination count={3} page={this.state.page} onChange={this.handleChange} />
                <Button onClick={this.getUsers}>Refresh</Button>
                <UserUpdate
                    userData={this.state.selUser}
                    open={this.state.showUserEdit}
                    onClose={this.handleClose} />
            </div >
        )
    }
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
