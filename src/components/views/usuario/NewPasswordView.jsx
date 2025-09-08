import React, { useState } from 'react';
import { NewPasswordToken } from '../../utils/auth/NewPasswordToken';
import { NewPasswordForm } from '../../utils/auth/NewPasswordForm';

export const NewPasswordView = () => {
    const [isValidToken, setIsValidToken] = useState(false)
    const [token, setToken] = useState('')

    return (
        <>
            {!isValidToken ?
                <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} /> :
                <NewPasswordForm token={token} />
            }
        </>
    );
};
