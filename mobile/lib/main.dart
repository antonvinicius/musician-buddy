// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        useMaterial3: true,
      ),
      home: Container(
        color: Colors.white,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Container(
                  color: Colors.blue,
                  width: 100,
                  height: 100,
                ),
                Container(
                  color: Colors.green,
                  width: 100,
                  height: 100,
                )
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Container(
                color: Colors.red,
                width: double.infinity,
                height: 50,
              ),
            ),
            Container(
              width: double.infinity,
              color: Colors.amber,
              child: const Text(
                "viniboné esteve aqui.",
                style: TextStyle(
                  color: Colors.blue,
                  decoration: TextDecoration.none,
                  fontSize: 22,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            ElevatedButton(
              onPressed: () {
                print("fala manolo!");
              },
              child: Text("Láaaa ele!"),
            )
          ],
        ),
      ),
    );
  }
}
