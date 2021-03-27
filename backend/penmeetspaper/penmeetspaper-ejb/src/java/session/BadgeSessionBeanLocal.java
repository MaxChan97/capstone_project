/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Badge;
import exception.NotValidException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Shawn Lim
 */
@Local
public interface BadgeSessionBeanLocal {

    public final static String MULTIPLE_BADGES_FOUND = "Multiple badges found";
    public final static String NO_BADGES_FOUND = "No badges found";

    public void createBadges();

    public Badge getBadgeByDisplayName(String displayName) throws NotValidException;

    public List<Badge> getAllBadges();
}
