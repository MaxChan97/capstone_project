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
        b1.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/badges%2FLevel%201.png?alt=media&token=cbfb6acb-e8b0-4124-bbdd-61e3edee129d");

        em.persist(b1);
        em.flush();

        Badge b2 = new Badge();
        b2.setDisplayName("Level 2 Badge");
        b2.setBadgeType(BadgeTypeEnum.OVERALL);
        b2.setValueRequired(10);
        b2.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/badges%2FLevel%202.png?alt=media&token=9c315e42-f9a6-4e24-8f50-3db8eb24748f");

        em.persist(b2);
        em.flush();

        Badge b3 = new Badge();
        b3.setDisplayName("Level 3 Badge");
        b3.setBadgeType(BadgeTypeEnum.OVERALL);
        b3.setValueRequired(30);
        b3.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/badges%2FLevel%203.png?alt=media&token=485e4c5b-e190-48b6-803e-933ce0ca7926");

        em.persist(b3);
        em.flush();

        Badge b4 = new Badge();
        b4.setDisplayName("Level 4 Badge");
        b4.setBadgeType(BadgeTypeEnum.OVERALL);
        b4.setValueRequired(80);
        b4.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/badges%2FLevel%204.png?alt=media&token=ab0bc2f4-b25e-4500-9759-120ce209bc44");

        em.persist(b4);
        em.flush();

        Badge b5 = new Badge();
        b5.setDisplayName("Level 5 Badge");
        b5.setBadgeType(BadgeTypeEnum.OVERALL);
        b5.setValueRequired(150);
        b5.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/badges%2FLevel%205.png?alt=media&token=03a64648-ea11-4db8-a000-59b97a96b6bb");

        em.persist(b5);
        em.flush();

        Badge b6 = new Badge();
        b6.setDisplayName("Level 6 Badge");
        b6.setBadgeType(BadgeTypeEnum.OVERALL);
        b6.setValueRequired(300);
        b6.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/badges%2FLevel%206.png?alt=media&token=933c4a8c-4534-43f7-af80-ebf21a1594f9");

        em.persist(b6);
        em.flush();

        Badge b7 = new Badge();
        b7.setDisplayName("Level 7 Badge");
        b7.setBadgeType(BadgeTypeEnum.OVERALL);
        b7.setValueRequired(800);
        b7.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/badges%2FLevel%207.png?alt=media&token=9877a62b-1526-43b1-a46c-536005e816e9");

        em.persist(b7);
        em.flush();

        Badge b8 = new Badge();
        b8.setDisplayName("Level 8 Badge");
        b8.setBadgeType(BadgeTypeEnum.OVERALL);
        b8.setValueRequired(1700);
        b8.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/badges%2FLevel%208.png?alt=media&token=61a8aaa0-2f7d-4d6d-9871-b3fe8446941b");

        em.persist(b8);
        em.flush();

        Badge b9 = new Badge();
        b9.setDisplayName("Level 9 Badge");
        b9.setBadgeType(BadgeTypeEnum.OVERALL);
        b9.setValueRequired(3500);
        b9.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/badges%2FLevel%209.png?alt=media&token=59f2600f-1131-4973-bc91-a6e52021d29b");

        em.persist(b9);
        em.flush();

        Badge b10 = new Badge();
        b10.setDisplayName("Level 10 Badge");
        b10.setBadgeType(BadgeTypeEnum.OVERALL);
        b10.setValueRequired(10);
        b10.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/badges%2FLevel%2010.png?alt=media&token=9d5c6b2f-a04e-4dc9-bbc5-807cec4ab835");

        em.persist(b10);
        em.flush();

        Badge topCommenter = new Badge();
        topCommenter.setDisplayName("Top commenter");
        topCommenter.setBadgeType(BadgeTypeEnum.COMMENT);
        topCommenter.setValueRequired(1000);
        topCommenter.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/badges%2FComments%20Badge.png?alt=media&token=e8a11cce-471c-4e8a-8b70-12ffed01d3de");

        em.persist(topCommenter);
        em.flush();

        Badge topStreamer = new Badge();
        topStreamer.setDisplayName("Top streamer");
        topStreamer.setBadgeType(BadgeTypeEnum.STREAM);
        topStreamer.setValueRequired(3);
        topStreamer.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/badges%2FVideos%20Streamed%20Badge.png?alt=media&token=ca1e7fce-d946-423c-b599-5d75d7b6b97c");

        em.persist(topStreamer);
        em.flush();

        Badge topFollower = new Badge();
        topFollower.setDisplayName("Top follower");
        topFollower.setBadgeType(BadgeTypeEnum.FOLLOWER);
        topFollower.setValueRequired(3);
        topFollower.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/badges%2FFollowers%20Badge.png?alt=media&token=1ce14370-a4a7-4fa6-b6c8-1fd86eebf66d");

        em.persist(topFollower);
        em.flush();

        Badge topPoster = new Badge();
        topPoster.setDisplayName("Top poster");
        topPoster.setBadgeType(BadgeTypeEnum.POST);
        topPoster.setValueRequired(4);
        topPoster.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/badges%2FPosts%20Badge.png?alt=media&token=c1c75dce-6289-4cea-8877-aa3a76e15baa");

        em.persist(topPoster);
        em.flush();
    }

    @Override
    public Badge getBadgeByDisplayName(String displayName) throws NotValidException {
        Query q = em.createQuery("SELECT b FROM Badge b WHERE b.displayName = :displayName");
        q.setParameter("displayName", displayName);

        List<Badge> badgeList = q.getResultList();
        if (badgeList.size() > 1) {
            throw new NotValidException(BadgeSessionBeanLocal.MULTIPLE_BADGES_FOUND);
        } else if (badgeList.isEmpty()) {
            throw new NotValidException(BadgeSessionBeanLocal.NO_BADGES_FOUND);
        } else {
            return badgeList.get(0);
        }
    }

    @Override
    public List<Badge> getAllBadges() {
        Query q = em.createQuery("SELECT b FROM Badge b");
        return q.getResultList();
    }

}
