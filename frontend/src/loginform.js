import React from "react"
import { Button, TextField, Stack, Alert } from "@mui/material";

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            success: false,
            message: "Not logged in"
        }
    }

    doLogin = () => {
        fetch("http://localhost:8000/login?email=" + this.state.email.trim() + "&password=" + this.state.password.trim())
            .then((res) => res.json())
            .then((resJS) => {
                console.log(resJS);
                if (resJS.error) { this.setState({ success: false, message: resJS.error }) }
                if (resJS.token) { this.setState({ success: true, message: "Logged in with token " + resJS.token }) }
            })
    }

    doLogin_direct = () => {
        fetch("https://reqres.in/api/login", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email.trim(),
                password: this.state.password.trim()
            })
        })
            .then((res) => res.json())
            .then((resJSON) => {
                //console.log(resJSON);
                if (resJSON.error) { this.setState({ success: false, message: resJSON.error }) }
                if (resJSON.token) { this.setState({ success: true, message: "Logged in with token " + resJSON.token }) }
            })
    }

    render() {
        return (
            <Stack sx={{ width: "100%" }}>
                <TextField
                    required
                    id="outlined-required"
                    label="Email"
                    defaultValue=""
                    onChange={(e) => { this.setState({ email: e.target.value }) }}
                />
                <TextField
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    onChange={(e) => { this.setState({ password: e.target.value }) }}
                />

                <Button onClick={this.doLogin}>Login</Button>

                {!this.state.success &&
                    <Alert severity="error">{this.state.message}</Alert>
                }

                {this.state.success &&
                    <Alert severity="success">{this.state.message}</Alert>
                }

            </Stack>
        )
    }
}