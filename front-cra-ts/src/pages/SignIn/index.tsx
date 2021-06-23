import useInput from "../../hooks/useInput";
import {
  Button,
  Error,
  Form,
  Header,
  Input,
  Label,
  LinkContainer,
  Success,
} from "../SignUp/styles";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";

// swr은 기본적으로 get요청에 대한 데이터를 저장한다, post를 못사용하는것은 아니다 통상적으로 get에 대한 데이터를 저장한다, 로딩상태를 알 수도 있다(data가 존재하지 않으면 로딩으로 간주)
// swr의 요청주기는 개발자가 지정할 수 있지만 굳이 그렇게 하지 않아도 탭만 다른곳 갔다가 와도 요청을 새로보낸다.
// useSWR은 ReactQuery와 대체가능
// fetcher라는 함수는 swr에 입력한 주소를 어떻게 처리할지 작성할 수 있다

//로그인은 대부분 쿠키에 저장한다 안전하기 떄문
//CORS는 브라우저를 사용하지 않으면  발생하지않고
//배포환경에서는 proxy를 사용하지 않는다 개발할때는 프론트에서 CORS를 해결하기 위한 방법중 하나다
const SignIn = () => {
  const { data, error, revalidate } = useSWR(
    "http://localhost:3095/api/users",
    fetcher,
    {
      dedupingInterval: 100000, //주기적으로 호출되는 것을 방지, 주기적으로 호출은 되지만 deduping 기간내에는 캐시에서 불러온다
    }
  );
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      console.log("로그인을 요청합니다 Data: ", email, password);
      axios
        .post(
          "http://localhost:3095/api/users/login",
          { email, password },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          console.log("LOGIN SUCCEED");
          revalidate(); //로그인 성공했을때만 fatcher 호출
        })
        .catch((error) => {
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password]
  );

  if (data === undefined) {
    //페이지 강제로 이동할때 로딩문구
    return <div>로딩중...</div>;
  }
  console.log("data: ", data);
  if (data) {
    return <Redirect to="/workspace/channel" />;
  }
  // console.log(error, userData);
  // if (!error && userData) {
  //   console.log("로그인됨", userData);
  //   return <Redirect to="/workspace/sleact/channel/일반" />;
  // }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChangeEmail}
            />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChangePassword}
            />
          </div>
          {logInError && (
            <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>
          )}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignIn;
