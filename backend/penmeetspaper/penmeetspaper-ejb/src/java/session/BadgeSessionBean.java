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

        Badge b2 = new Badge();
        b2.setDisplayName("Level 2 Badge");
        b2.setBadgeType(BadgeTypeEnum.OVERALL);
        b2.setValueRequired(1000);
        b2.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/images%2F7e0f929c-0872-4547-bf01-e3eb159151d1.png?alt=media&token=40734e1e-e458-413d-aafa-2c87f24fc409");

        em.persist(b2);
        em.flush();

        Badge b3 = new Badge();
        b3.setDisplayName("Level 3 Badge");
        b3.setBadgeType(BadgeTypeEnum.OVERALL);
        b3.setValueRequired(1000);
        b3.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/images%2Fd7b392d6-9656-499c-8c21-d3e273c2c1b5.png?alt=media&token=83d54525-7b4c-43d6-bc19-9df6f277b9e3");

        em.persist(b3);
        em.flush();

        Badge b4 = new Badge();
        b4.setDisplayName("Level 4 Badge");
        b4.setBadgeType(BadgeTypeEnum.OVERALL);
        b4.setValueRequired(1000);
        b4.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/images%2Fb5d8ca6b-b751-43c4-91e0-6dd517cc11a3.png?alt=media&token=95193b1b-27e4-4c92-a065-79f9d10eb175");

        em.persist(b4);
        em.flush();

        Badge b5 = new Badge();
        b5.setDisplayName("Level 5 Badge");
        b5.setBadgeType(BadgeTypeEnum.OVERALL);
        b5.setValueRequired(1000);
        b5.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/images%2F72afa395-c09f-4603-ae2e-604081c4e90b.png?alt=media&token=e8ac058d-0337-44fb-895f-6dfc30e51646");

        em.persist(b5);
        em.flush();

        Badge b6 = new Badge();
        b6.setDisplayName("Level 6 Badge");
        b6.setBadgeType(BadgeTypeEnum.OVERALL);
        b6.setValueRequired(1000);
        b6.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/images%2Fe6084d50-4602-489c-bf8e-3a3071d8b1f5.png?alt=media&token=4c4858f3-18ff-4bb0-9d26-9ec356d21796");

        em.persist(b6);
        em.flush();

        Badge b7 = new Badge();
        b7.setDisplayName("Level 7 Badge");
        b7.setBadgeType(BadgeTypeEnum.OVERALL);
        b7.setValueRequired(1000);
        b7.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/images%2Ff113b184-3dd8-40a7-9b79-7e5bb4fb1aac.png?alt=media&token=130ff9a8-6851-4714-953f-d0bbecd535f0");

        em.persist(b7);
        em.flush();

        Badge b8 = new Badge();
        b8.setDisplayName("Level 8 Badge");
        b8.setBadgeType(BadgeTypeEnum.OVERALL);
        b8.setValueRequired(1000);
        b8.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/images%2F2acb559d-d237-4fa3-8f26-8e3ef5373a03.png?alt=media&token=8866486a-8d28-43e3-a64e-807365717e8e");

        em.persist(b8);
        em.flush();

        Badge b9 = new Badge();
        b9.setDisplayName("Level 9 Badge");
        b9.setBadgeType(BadgeTypeEnum.OVERALL);
        b9.setValueRequired(1000);
        b9.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/images%2Fa80e874a-bfb6-44e2-8a45-de42c9e0784b.png?alt=media&token=188b253e-7553-4f35-940b-12372cef6c72");

        em.persist(b9);
        em.flush();

        Badge b10 = new Badge();
        b10.setDisplayName("Level 10 Badge");
        b10.setBadgeType(BadgeTypeEnum.OVERALL);
        b10.setValueRequired(1000);
        b10.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/images%2F53bcd42c-b167-469a-aedb-7277a1bcf85c.png?alt=media&token=61ae201c-e6ed-4e73-ae5c-c7bf245e7a9f");

        em.persist(b10);
        em.flush();

        Badge topCommenter = new Badge();
        topCommenter.setDisplayName("Top commenter");
        topCommenter.setBadgeType(BadgeTypeEnum.CONTRIBUTION);
        topCommenter.setValueRequired(1000);
        topCommenter.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/images%2F950cb5c6-6df2-4b5e-b60e-09a3e29b3ec8.png?alt=media&token=dca76d99-8612-4b2f-929c-0505dde414b6");

        em.persist(topCommenter);
        em.flush();

        Badge topStreamer = new Badge();
        topStreamer.setDisplayName("Top streamer");
        topStreamer.setBadgeType(BadgeTypeEnum.STREAM);
        topStreamer.setValueRequired(1000);
        topStreamer.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/images%2F1fcf5791-7d34-4700-9912-fb51b677666a.png?alt=media&token=51e2efe7-47ad-4ca9-ac2b-2333f9ba49d8");

        em.persist(topStreamer);
        em.flush();

        Badge topFollower = new Badge();
        topFollower.setDisplayName("Top follower");
        topFollower.setBadgeType(BadgeTypeEnum.OVERALL);
        topFollower.setValueRequired(1000);
        topFollower.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/images%2F1fcf5791-7d34-4700-9912-fb51b677666a.png?alt=media&token=51e2efe7-47ad-4ca9-ac2b-2333f9ba49d8");

        em.persist(topFollower);
        em.flush();

        Badge topPoster = new Badge();
        topPoster.setDisplayName("Top poster");
        topPoster.setBadgeType(BadgeTypeEnum.CONTRIBUTION);
        topPoster.setValueRequired(1000);
        topPoster.setImage("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/images%2F0173f2eb-95cf-4b4a-9224-79942fdc4368.png?alt=media&token=ed6ea42f-6ccc-4a12-a7f4-c1ce69f27a17");

        em.persist(topPoster);
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

    @Override
    public List<Badge> getAllBadges() {
        Query q = em.createQuery("SELECT b FROM Badge b");
        return q.getResultList();
    }

}
