import React from 'react'

import { roles } from '../data'

export const Storyteller = () => {
    console.log(roles)
    return (
        Object.keys(roles).map(role => {
            return (
                <label key={role}>
                    <input type='checkbox' id={role} />
                    {role}
                </label>
            )
        })
    )
}