import React from "react"
import { Button, TextField, Stack, Alert } from "@mui/material";
import encryptor from "./encryptor";

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
        this.publicKey = document.getElementById("publicKey").value;
        this.enc = new encryptor(this.publicKey);
        var credentials = this.enc.encrypt(JSON.stringify({
            email: this.state.email.trim(),
            password: this.state.password.trim()
        }));

        fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ credentials: credentials })
        })
            .then((res) => res.json())
            .then((resJSON) => {
                if (!resJSON.status) { this.setState({ success: false, message: resJSON.message }) }
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

                <input id="publicKey" type="hidden" value="-----BEGIN PUBLIC KEY-----
                    MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAtUmkfa7DwEQnQMM5aS/F
                    pCbgKThc4eJGYHJwQqim3+6KdHPHsQCKfK0Ku22WZXIySbk9TxW3Zq7eusc4wEHB
                    4s+3ZhLJh/eSv+Cg160Zxvlm9WsnP0CTaBMfr3wRVyia1FMTbznmq5azKrbN7V1U
                    NWD1qumApBFaPs9esQ48htgx/vGZML0mLo/wEy3w9Due7c6AuaeiXGsYpTXDbz0K
                    KysQDtRjp9ltCX31cdycI3+DzOPAi4t8CztvFqymmTFRKkO9khV0ZwHgf4TUidC4
                    ssx7KfTQpyWkDGv8vVrH+ALdmln8WpwARX8DHwyfF2eW2y5kIZhMo9wiNIddM3SR
                    9kcst0EXAb8M5nlvxACyIU37VprbXHG0d408GjObcnO2p/BXqsUCh0RFp8FccNrG
                    87a9E/inpYAgalshsotx6gUX7CNA3N5wAmIAOSwKbDKJXFXaJthpUfxvGKXhzmVF
                    xtLi1bS0e4n2pP5H3fd2tFAsFnDp4wnboyuq+/BXW0K4eF0G6dnBCffcO5f4SN6A
                    TrnYBhanqJ8WW+8XUevoce2mxSYnWwaOgad3vNFYAXoqll+clLg9WbtgsZx33Fpn
                    yh7PV0VZGIvl2kFsjwIpuNaNBnfJ1xDrSo+4zB/0EfBNKqeD37SUxj1gX4jTLrWZ
                    mYAS1Do/DanESVjJUI0betcCAwEAAQ==
                    -----END PUBLIC KEY-----"/>
            </Stack>

        )
    }
}