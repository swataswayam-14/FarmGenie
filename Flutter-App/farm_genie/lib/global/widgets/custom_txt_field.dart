import 'package:flutter/material.dart';

class CustomTextField extends StatefulWidget {
  final String hintText;
  final TextEditingController controller;
  final TextInputType type;
  final IconData icon;
  final ValueChanged<String?> onChanged;
  final bool isObscure;
  final bool isPassword;
  final FormFieldValidator? validator;

  const CustomTextField({
    super.key,
    required this.hintText,
    required this.controller,
    required this.type,
    required this.icon,
    required this.onChanged,
    this.isObscure = false,
    this.isPassword = false,
    this.validator,
  });

  @override
  State<CustomTextField> createState() => _CustomTextFieldState();
}

class _CustomTextFieldState extends State<CustomTextField> {
  late bool _isObscure;

  @override
  void initState() {
    super.initState();
    _isObscure = widget.isObscure;
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
          maxLines: null,
          obscureText: widget.isObscure,
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
