package com.anthill.coinswapscannermvc;

import com.anthill.coinswapscannermvc.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.NoHandlerFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<String> noHandlerFoundException(NoHandlerFoundException ex) {

        return new ResponseEntity<>("No handler found for your request.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<String> methodNotAllowedException(HttpRequestMethodNotSupportedException ex) {

        return new ResponseEntity<>("Method not allowed.", HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<String> missingServletRequestParameterException(MissingServletRequestParameterException ex) {

        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpClientErrorException.NotFound.class)
    public ResponseEntity<String> resourceNotFounded(HttpClientErrorException.NotFound ex){

        return new ResponseEntity<>("Requested resource not founded :(", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserNotFoundedException.class)
    public ResponseEntity<String> userNotFoundedException(UserNotFoundedException ex){

        return new ResponseEntity<>("User not found :(", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ResourceNotFoundedException.class)
    public ResponseEntity<String> resourceNotFounded(ResourceNotFoundedException ex){

        String resource = ex.getResource() != null? " " + ex.getResource() + " " : " ";
        return new ResponseEntity<>("Requested resource" + resource + "not founded :(", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ResourceAlreadyExists.class)
    public ResponseEntity<String> resourceAlreadyExists(ResourceAlreadyExists ex){

        return new ResponseEntity<>("Attempt to create already exists resource :(", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(LoginAlreadyTakenException.class)
    public ResponseEntity<String> loginAlreadyTakenException(LoginAlreadyTakenException ex){

        return new ResponseEntity<>("Login already taken :(", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpClientErrorException.Forbidden.class)
    public ResponseEntity<String> resourceNotFounded(HttpClientErrorException.Forbidden ex){

        return new ResponseEntity<>("Access denied :(", HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> resourceNotFounded(AccessDeniedException ex){

        return new ResponseEntity<>("Access denied :(", HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(IncorrectPasswordException.class)
    public ResponseEntity<String> incorrectPassword(IncorrectPasswordException ex){

        return new ResponseEntity<>("Incorrect password :(", HttpStatus.BAD_REQUEST);
    }
}
