import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setSpotifyData } from "@store/actions";
import { saveRefreshToken } from "@functions/spotify.functions";
const SpotifyCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { access_token, refresh_token } = router.query;
      if (access_token && refresh_token) {
        await saveRefreshToken(refresh_token as string);
        let date = new Date();
        date.setSeconds(date.getSeconds() + 3000);
        console.log(date);
        dispatch(
          setSpotifyData({
            accessToken: access_token as string,
            refreshToken: refresh_token as string,
            expiresAt: date.toISOString(),
          })
        );

        router.push("/");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);
  return <div>SpotifyCallback</div>;
};

export default SpotifyCallback;
