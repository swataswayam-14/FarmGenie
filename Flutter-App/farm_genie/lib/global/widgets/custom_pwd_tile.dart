import 'package:flutter/material.dart';

class CustomPwdTile extends StatefulWidget {
  final String hintText;
  final TextEditingController controller;
  final TextInputType type;
  final IconData icon;
  final ValueChanged<String?> onChanged;
  final bool isPassword;
  final FormFieldValidator? validator;

  const CustomPwdTile({
    super.key,
    required this.hintText,
    required this.controller,
    required this.type,
    required this.icon,
    required this.onChanged,
    this.isPassword = true, // Default to true since it's a password field
    this.validator,
  });

  @override
  State<CustomPwdTile> createState() => _CustomPwdTileState();
}

class _CustomPwdTileState extends State<CustomPwdTile> {
  late bool _isObscure;

  @override
  void initState() {
    super.initState();
    _isObscure = true; // Passwords are obscured by default
  }

  @override
  Widget build(BuildContext context) {
    final suffixIcon = widget.isPassword
        ? IconButton(
            icon: _isObscure
                ? const Icon(Icons.visibility)
                : const Icon(Icons.visibility_outlined),
            onPressed: () {
              setState(() {
                _isObscure = !_isObscure;
              });
            },
          )
        : null;

    return ConstrainedBox(
      constraints: const BoxConstraints(
        minHeight: 60.0,
        maxHeight: 80.0,
      ),
      child: SizedBox(
        width: 300,
        child: TextFormField(
          validator: widget.validator,
          obscureText: _isObscure,
          controller: widget.controller,
          onChanged: widget.onChanged,
          decoration: InputDecoration(
            prefixIcon: Icon(
              widget.icon,
              // color: AppTheme.primaryColor,
            ),
            enabledBorder: OutlineInputBorder(
              borderSide: BorderSide(
                  // color: AppTheme.primaryColor,
                  ),
              borderRadius: BorderRadius.circular(10),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(
                // color: AppTheme.primaryColor,
                width: 2.0,
              ),
              borderRadius: BorderRadius.circular(10),
            ),
            errorBorder: OutlineInputBorder(
              borderSide: const BorderSide(
                color: Colors.red,
                width: 2.0,
              ),
              borderRadius: BorderRadius.circular(10),
            ),
            hintText: widget.hintText,
            hintStyle: const TextStyle(fontSize: 15),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 10.0,
              vertical: 15.0,
            ),
            suffixIcon: suffixIcon,
          ),
          keyboardType: widget.type,
        ),
      ),
    );
  }
}
