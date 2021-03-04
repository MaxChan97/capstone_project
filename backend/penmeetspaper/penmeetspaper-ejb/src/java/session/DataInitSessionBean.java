/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Community;
import entity.personEntities.Person;
import enumeration.TopicEnum;
import exception.NoResultException;
import exception.NotValidException;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.PostConstruct;
import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Singleton;
import javax.ejb.Startup;

/**
 *
 * @author Shawn
 */
@Singleton
@LocalBean
@Startup
public class DataInitSessionBean {

    @EJB
    private BanSessionBeanLocal banSB;

    @EJB
    private ChatSessionBeanLocal chatSB;

    @EJB
    private CommentSessionBeanLocal commentSB;

    @EJB
    private CommunitySessionBeanLocal communitySB;

    @EJB
    private FollowerSessionBeanLocal followSB;
    @EJB
    private PersonSessionBeanLocal personSB;

    @EJB
    private MessageSessionBeanLocal messageSB;

    @EJB
    private PostSessionBeanLocal postSB;

    @EJB
    private ReplySessionBeanLocal replySB;

    @EJB
    private SubscriptionSessionBeanLocal subSB;

    public DataInitSessionBean() {
    }

    @PostConstruct
    public void postConstruct() {
        try {
            personSB.getPersonById(new Long(1));
        } catch (NoResultException | NotValidException ex) {
            initData();
        }
    }

    private void createPersons() throws NotValidException {
        Person user1 = new Person();
        user1.setUsername("user1");
        user1.setEmail("user1@email.com");
        user1.setPassword("password");

        Person user2 = new Person();
        user2.setUsername("user2");
        user2.setEmail("user2@email.com");
        user2.setPassword("password");

        Person user3 = new Person();
        user3.setUsername("user3");
        user3.setEmail("user3@email.com");
        user3.setPassword("password");

        Person user4 = new Person();
        user4.setUsername("user4");
        user4.setEmail("user4@email.com");
        user4.setPassword("password");

        Person user5 = new Person();
        user5.setUsername("user5");
        user5.setEmail("user5@email.com");
        user5.setPassword("password");

        Person user6 = new Person();
        user6.setUsername("user6");
        user6.setEmail("user6@email.com");
        user6.setPassword("password");

        Person user7 = new Person();
        user7.setUsername("user7");
        user7.setEmail("user7@email.com");
        user7.setPassword("password");

        personSB.createPerson(user1);
        personSB.createPerson(user2);
        personSB.createPerson(user3);
        personSB.createPerson(user4);
        personSB.createPerson(user5);
        personSB.createPerson(user6);
        personSB.createPerson(user7);
    }

    private void createCommunities() throws NotValidException, NoResultException {
        String defaultCommunityPicture = "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Default%20Dp%20logo.svg?alt=media&token=8e2c7896-9e1f-4541-8934-bb00543bd9bb";
        String defaultCommunityBanner = "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Profile%20Banner%20Image.png?alt=media&token=e59ee28d-8388-4e81-8fd7-8d6409690897";

        List<TopicEnum> topicEnums = new ArrayList();

        Community comm1 = new Community();
        comm1.setDescription("Bacon ipsum dolor amet shank landjaeger ham porchetta, buffalo pork ribeye leberkas meatball ground round tenderloin shankle. Chuck doner short ribs, kevin drumstick shank pork loin burgdoggen. Shank beef ribs chislic chicken.");
        comm1.setName("WallStreetBets");
        comm1.setCommunityProfilePicture(defaultCommunityPicture);
        comm1.setCommunityBanner(defaultCommunityBanner);
        topicEnums.add(TopicEnum.STOCKS);
        comm1.setTopicEnums(topicEnums);

        topicEnums = new ArrayList();
        Community comm2 = new Community();
        comm2.setDescription("Pork belly tongue pork drumstick cupim, jerky pastrami porchetta beef ribs pork chop chicken biltong.");
        comm2.setName("CryptoCurrencies");
        comm2.setCommunityProfilePicture(defaultCommunityPicture);
        comm2.setCommunityBanner(defaultCommunityBanner);
        topicEnums.add(TopicEnum.CRYPTOCURRENCY);
        comm2.setTopicEnums(topicEnums);

        topicEnums = new ArrayList();
        Community comm3 = new Community();
        comm3.setDescription("Porchetta venison ball tip, filet mignon boudin landjaeger prosciutto tongue ribeye.");
        comm3.setName("Soybeans");
        comm3.setCommunityProfilePicture(defaultCommunityPicture);
        comm3.setCommunityBanner(defaultCommunityBanner);
        topicEnums.add(TopicEnum.FUTURES);
        comm3.setTopicEnums(topicEnums);

        topicEnums = new ArrayList();
        Community comm4 = new Community();
        comm4.setDescription("Chuck alcatra capicola, fatback prosciutto kevin tri-tip pig ground round.");
        comm4.setName("HDB");
        comm4.setCommunityProfilePicture(defaultCommunityPicture);
        comm4.setCommunityBanner(defaultCommunityBanner);
        topicEnums.add(TopicEnum.REAL_ESTATE);
        comm4.setTopicEnums(topicEnums);

        communitySB.createCommunity(comm1, new Long(1));
        communitySB.createCommunity(comm2, new Long(1));
        communitySB.createCommunity(comm3, new Long(1));
        communitySB.createCommunity(comm4, new Long(2));
    }

    private void createFollows() throws NotValidException, NoResultException {
        followSB.followPerson(new Long(2), new Long(1));
        followSB.followPerson(new Long(3), new Long(1));
        followSB.followPerson(new Long(4), new Long(1));
        followSB.followPerson(new Long(5), new Long(1));
        followSB.followPerson(new Long(6), new Long(1));
        followSB.followPerson(new Long(7), new Long(1));

        followSB.followPerson(new Long(1), new Long(2));
        followSB.followPerson(new Long(1), new Long(3));
        followSB.followPerson(new Long(1), new Long(4));
        followSB.followPerson(new Long(1), new Long(5));
    }

    private void createSubs() throws NotValidException, NoResultException {
        subSB.subscribeToPerson(new Long(1), new Long(2));
        subSB.subscribeToPerson(new Long(1), new Long(3));
        subSB.subscribeToPerson(new Long(1), new Long(4));
        subSB.subscribeToPerson(new Long(1), new Long(5));
        subSB.unsubscribeToPerson(new Long(1), new Long(2));

        subSB.subscribeToPerson(new Long(5), new Long(1));
        subSB.subscribeToPerson(new Long(6), new Long(1));
        subSB.subscribeToPerson(new Long(7), new Long(1));
    }

    private void initData() {

        try {
            createPersons();
            createCommunities();
            createFollows();
            createSubs();
        } catch (NotValidException | NoResultException ex) {
            ex.printStackTrace();
        }
    }
}
