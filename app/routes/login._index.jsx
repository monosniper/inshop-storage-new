import globalStyles from "~/styles/global.css";
import styles from "~/styles/pages/login.css";
import OAuth2Login from "react-simple-oauth2-login";
import {json} from "@remix-run/node";
import {useFetcher, useLoaderData, useSearchParams} from "@remix-run/react";
import {createUserSession, login} from "~/utils/session.server";
import logoImg from '~/assets/img/logo.svg'

export function links() {
    return [
        { rel: "stylesheet", href: globalStyles },
        { rel: "stylesheet", href: styles },
    ];
}

const badRequest = (data) => json(data, { status: 400 });

export const action = async ({ request }) => {
    // const body = await request.json()

    const formData = await request.formData();
    const code = formData.get('code')
    const redirectTo = formData.get('redirectTo')

    const data = await login(code, request)

    if (!data) {
        return badRequest({
            formError: `Произошла какая-то ошибка.`,
        });
    }

    return createUserSession(data, redirectTo);
};

export const loader = async () => {
    return json({
        API_ORIGIN_URL: process.env.API_ORIGIN_URL,
        OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID,
        OAUTH_CLIENT_REDIRECT_URI: process.env.OAUTH_CLIENT_REDIRECT_URI,
    });
};

const Login_index = () => {
    const fetcher = useFetcher();
    const loaderData = useLoaderData()
    const [searchParams] = useSearchParams();

    const onSuccess = (rs) => {
        fetcher.submit({
            code: rs.code,
            redirectTo: searchParams.get("redirectTo") ?? undefined
        }, {method:'post'})
    }

    return (
        <div className={"wrapper"}>
            <fetcher.Form method="post" />
            <div className="big-logo">
                <img src={logoImg} />
            </div>
            <OAuth2Login
                authorizationUrl={loaderData.API_ORIGIN_URL + "/oauth/authorize"}
                responseType="code"
                clientId={loaderData.OAUTH_CLIENT_ID}
                redirectUri={loaderData.OAUTH_CLIENT_REDIRECT_URI}
                onSuccess={onSuccess}
                // isCrossOrigin={true}
                onFailure={(rs) => console.error(rs)}
                state={''}
                render={({onClick}) => <button className={"sign-btn"} onClick={onClick}>
                    Авторизация
                </button>}
            />
        </div>
    );
}

export default Login_index