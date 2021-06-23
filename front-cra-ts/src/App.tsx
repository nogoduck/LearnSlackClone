import React from "react";
import loadable from "@loadable/component";
import { Switch, Route, Redirect } from "react-router-dom";

const SignIn = loadable(() => import("./pages/SignIn"));
const SignUp = loadable(() => import("./pages/SignUp"));

//코드 스플리팅 : 필요한 컴포넌트만 불러오는 기법, 페이지도 가능
//설치할 모듈 : @loadable/component / typescript를 하면 @types/loadable__component 추가설치
function App() {
  return (
    <>
      <Switch>
        <Redirect exact path="/" to="signin" />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
      </Switch>
    </>
  );
}

export default App;
