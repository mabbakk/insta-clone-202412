// controller/RouteController.java
package com.example.instagramclone.controller.routes;

// jsp 파일을 여는 컨트롤러!

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RouteController {

    @GetMapping("/")
    public String index() {
        
//        return "index";    // 나중에 로그인 후 복귀할 때 주석해제
        return "auth/login";
    }


    // 회원가입 페이지 열기
    @GetMapping("/signup")
    public String signup() {
        return "auth/signup";
    }

}
