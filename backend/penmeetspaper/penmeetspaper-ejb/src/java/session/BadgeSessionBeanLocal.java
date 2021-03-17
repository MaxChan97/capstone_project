/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import javax.ejb.Local;

/**
 *
 * @author Shawn Lim
 */
@Local
public interface BadgeSessionBeanLocal {

    public final static String MULTIPLE_BADGES_FOUND = "Multiple badges found";

    public void createBadges();
}
