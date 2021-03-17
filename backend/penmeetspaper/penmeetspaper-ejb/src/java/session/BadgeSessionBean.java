/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Badge;
import enumeration.BadgeTypeEnum;
import exception.NotValidException;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author Shawn Lim
 */
@Stateless
public class BadgeSessionBean implements BadgeSessionBeanLocal {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void createBadges() {
        Badge b1 = new Badge();
        b1.setDisplayName("Level 1 Badge");
        b1.setBadgeType(BadgeTypeEnum.OVERALL);
        b1.setValueRequired(0);
        b1.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/images%2Fcb9ed069-e3f7-4db4-bf58-bb7d61007618.png?alt=media&token=6269f3b9-9bd4-4143-9914-2b874b3e191e");

        em.persist(b1);
        em.flush();

    }

    @Override
    public Badge getBadgeByDisplayName(String displayName) throws NotValidException {
        Query q = em.createQuery("SELECT b FROM Badge b WHERE LOWER(b.displayName) = :displayName");
        q.setParameter("displayName", "%" + displayName.toLowerCase() + "%");

        List<Badge> badgeList = q.getResultList();
        if (badgeList.size() > 1) {
            throw new NotValidException(BadgeSessionBeanLocal.MULTIPLE_BADGES_FOUND);
        } else if (badgeList.isEmpty()) {
            throw new NotValidException(BadgeSessionBeanLocal.NO_BADGES_FOUND);
        } else {
            return badgeList.get(0);
        }
    }

}
