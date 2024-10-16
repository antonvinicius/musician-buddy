import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:mobile/components/button_component.dart';
import 'package:mobile/components/textfield_component.dart';
import 'package:http/http.dart' as http;

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final usernameController = TextEditingController();
    final passwordController = TextEditingController();

    Future<http.Response> requestSignIn(String username, String password) {
      return http.post(
        Uri.parse(
            "https://musician-buddy-production.up.railway.app/auth/login"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"username": username, "password": password}),
      );
    }

    void onSignIn() async {
      var username = usernameController.value.text;
      var password = passwordController.value.text;

      try {
        http.Response response = await requestSignIn(username, password);

        if (response.statusCode == 201) {
          print("Login bem sucedido ${response.body}");
        } else {
          print("Erro ao realizar login ${response.body}");
        }
      } catch (e) {
        print("Erro ao tentar fazer login: $e");
      } finally {
        usernameController.clear();
        passwordController.clear();
      }
    }

    void onRegister() {}

    return Scaffold(
      backgroundColor: Colors.grey[300],
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const SizedBox(height: 50),
              const Icon(Icons.lock, size: 100),
              const SizedBox(height: 50),
              const Text(
                "Welcome back, you've been missed!",
                style: TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 25),
              TextfieldComponent(
                controller: usernameController,
                hintText: "Username",
                obscureText: false,
              ),
              const SizedBox(height: 15),
              TextfieldComponent(
                controller: passwordController,
                hintText: "Password",
                obscureText: true,
              ),
              const SizedBox(height: 25),
              ButtonComponent(
                onTap: onSignIn,
              ),
              const SizedBox(height: 25),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text("Not a member?"),
                  const SizedBox(width: 4),
                  InkWell(
                    onTap: onRegister,
                    child: const Padding(
                      padding: EdgeInsets.all(4.0),
                      child: Text(
                        "Register now",
                        style: TextStyle(
                          color: Colors.blue,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  )
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
