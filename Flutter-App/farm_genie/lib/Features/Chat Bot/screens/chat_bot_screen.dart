import 'package:flutter/material.dart';

class ChatBotScreen extends StatefulWidget {
  const ChatBotScreen({
    super.key,
  });

  @override
  State<ChatBotScreen> createState() => _ChatBotScreenState();
}

class _ChatBotScreenState extends State<ChatBotScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Chat with me',
        ),
      ),
      body: const Align(
        alignment: Alignment.bottomCenter,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Expanded(child: SizedBox()),
            BottomTextField(),
          ],
        ),
      ),
    );
  }
}

class BottomTextField extends StatefulWidget {
  const BottomTextField({
    super.key,
  });

  @override
  State<BottomTextField> createState() => _BottomTextFieldState();
}

class _BottomTextFieldState extends State<BottomTextField> {
  final _controller = TextEditingController();
  bool isReplying = false;
  bool isSend = false;
  void sendTextMessage(bool isReplying) {
    if (isSend && isReplying) {
    } else if (isSend && !isReplying) {}
  }

  @override
  void dispose() {
    super.dispose();
    _controller.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                SizedBox(
                  width: MediaQuery.of(context).size.width * 0.80,
                  child: Column(
                    children: [
                      TextField(
                        onChanged: (val) {
                          if (val.isNotEmpty) {
                            isSend = true;
                            setState(() {});
                          } else {
                            isSend = false;
                            setState(() {});
                          }
                        },
                        controller: _controller,
                        decoration: const InputDecoration(
                          filled: true,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.all(Radius.circular(12)),
                            borderSide: BorderSide(
                              width: 0,
                              style: BorderStyle.none,
                            ),
                          ),
                          suffixIcon: Padding(
                            padding: EdgeInsets.symmetric(horizontal: 20.0),
                          ),
                          hintText: "Message",
                        ),
                      ),
                    ],
                  ),
                ),
                FloatingActionButton(
                    onPressed: () {},
                    shape: const CircleBorder(
                      side: BorderSide.none,
                    ),
                    child: const Icon(Icons.send)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
