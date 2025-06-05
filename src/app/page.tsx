import { Button } from "@mantine/core";
import Link from "next/link";

const clientId = "E69B1725E46F1E7855155A622D7952CF616D37C90D134955B4604150B175DF69"
const redirectUri = "https://sleek-barracuda-414.convex.site/callback"
const scope = "account-info+operation-history+payment-p2p"
const responseType = "code"
// TODO: add scope
const url = `https://yoomoney.ru/oauth/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scope}`
export default function Home() {
  return (
    <>
      <Button component={Link} href={url}>
        Войти через YooMoney
      </Button>
    </>
  );
}
