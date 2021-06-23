import axios from "axios";
import axois from "axios";

//swr에 넣은 주소를 fetcher의 매개변수로 넘겨준다
//프론트서버 주소와 백앤드서버 주소(도메인)가 다르면 쿠키가 전달되지 않는다(백앤드에서 CORS문제를 해결해주어도 소용없음)
//이를 해결하기 위해 withCredentials:true 옵션을 넣어준다.
// get요청에서는 매개변수의 두번째 자리에 넣어주고 post요청시에는 세번째 자리에 넣어준다.
//쿠키는 백앤드에서 생성하고 프론트 브라우저에 기억을 하게하고
//프론트앤드에서는 쿠키를 기억해둿다가 백앤드에 보내준다.
const fetcher = (url: string) => {
  return axios
    .get(url, {
      withCredentials: true,
    })
    .then((res) => {
      return res.data;
    });
};

export default fetcher;
