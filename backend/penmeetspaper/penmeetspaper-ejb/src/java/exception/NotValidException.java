/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package exception;

/**
 *
 * @author carlc
 */
public class NotValidException extends Exception {
  
  public NotValidException() {
  }

  public NotValidException(String s) {
    super(s);
  }
}
