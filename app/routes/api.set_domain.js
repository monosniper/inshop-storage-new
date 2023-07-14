import {getUserSession} from "../utils/session.server";
import {redirect} from "@remix-run/node";
import {commitSession} from "../sessions";

export const action = async ({ request }) => {
    const formData = await request.formData();

    const domain = formData.get('domain')
    const redirectTo = formData.get('redirectTo')
    const session = await getUserSession(request);

    session.set("domain", domain);

    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
};

export default <></>