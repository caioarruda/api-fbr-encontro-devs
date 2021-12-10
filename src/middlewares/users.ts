import { Users } from "../models/users"

let pubsub: any
const setUserPubSub = (ps: any) => {
    pubsub = ps
}
const onUpdateUser = async (
    resolve: any,
    source: any,
    args: any,
    context: any,
    info: any
) => {
    const res = await resolve(source, args, context, info)

    await pubsub.publish("USER_UPDATED", res?.record)
    return res
}

const existEmail = async (
    resolve: any,
    root: any,
    args: any,
    context: any,
    info: any
) => {
    try {
        const { email } = args?.record || {}
        const user = await Users.findOne({ email })
        if (user)
            throw new Error("Email existente")
        const result = await resolve(root, args, context, info)
        return result
    } catch (err: any) {
        throw new Error(err)
    }
}

export default { onUpdateUser, setUserPubSub, existEmail }