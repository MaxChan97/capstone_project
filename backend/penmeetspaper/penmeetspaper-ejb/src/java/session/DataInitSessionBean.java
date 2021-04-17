/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Administrator;
import entity.Badge;
import entity.Comment;
import entity.Community;
import entity.Person;
import entity.PersonAnswer;
import entity.Poll;
import entity.Post;
import entity.Reply;
import enumeration.IncomeRangeEnum;
import enumeration.TopicEnum;
import exception.NoResultException;
import exception.NotValidException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;
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
    private AdministratorSessionBeanLocal administratorSB;

    @EJB
    private BanSessionBeanLocal banSB;

    @EJB
    private BadgeSessionBeanLocal badgeSB;

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
    private PersonAnswerSessionBeanLocal paSB;

    @EJB
    private PollSessionBeanLocal pollSB;

    @EJB
    private MessageSessionBeanLocal messageSB;

    @EJB
    private PostSessionBeanLocal postSB;

    @EJB
    private ReplySessionBeanLocal replySB;

    @EJB
    private SubscriptionSessionBeanLocal subSB;

    @EJB
    private AnalyticsSessionBeanLocal analyticsSB;

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

    private void createSiteWideAnalytics() {
        analyticsSB.createSiteWideAnalytics();
    }

    private void createMasterAdmin() throws NotValidException {
        Administrator masterAdmin = new Administrator();
        masterAdmin.setEmail("admin@bnb.com");
        masterAdmin.setUsername("masterAdmin");
        masterAdmin.setPassword("password");

        administratorSB.createMasterAdmin(masterAdmin);
    }

    private void createPersons() throws NotValidException {
        Person user1 = new Person();
        user1.setUsername("xiaoming_");
        user1.setEmail("xiaoming@gmail.com");
        user1.setPassword("password");

        Person user2 = new Person();
        user2.setUsername("jenny_hodl");
        user2.setEmail("jennytan@yahoo.com.sg");
        user2.setPassword("password");

        Person user3 = new Person();
        user3.setUsername("alanxalan");
        user3.setEmail("alandsouza@hotmail.com");
        user3.setPassword("password");

        Person user4 = new Person();
        user4.setUsername("iLoveCrypto");
        user4.setEmail("ilovecrypto@gmail.com");
        user4.setPassword("password");

        Person user5 = new Person();
        user5.setUsername("tothemoon");
        user5.setEmail("tothemoon@gmail.com");
        user5.setPassword("password");

        Person user6 = new Person();
        user6.setUsername("TheInsuranceGuru");
        user6.setEmail("theinsuranceguru@yahoo.com.sg");
        user6.setPassword("password");

        Person user7 = new Person();
        user7.setUsername("apeboi97");
        user7.setEmail("apeboi97@gmail.com");
        user7.setPassword("password");

        Person user101 = new Person();
        user101.setUsername("Alice");
        user101.setEmail("alice@gmail.com");
        user101.setPassword("password");

        Person user102 = new Person();
        user102.setUsername("Bob");
        user102.setEmail("bob@gmail.com");
        user102.setPassword("password");

        Person user103 = new Person();
        user103.setUsername("Carl");
        user103.setEmail("carl@gmail.com");
        user103.setPassword("password");

        Person user104 = new Person();
        user104.setUsername("Desmond");
        user104.setEmail("desmond@gmail.com");
        user104.setPassword("password");

        Person user105 = new Person();
        user105.setUsername("Enola");
        user105.setEmail("enola@gmail.com");
        user105.setPassword("password");

        Person user106 = new Person();
        user106.setUsername("Fred");
        user106.setEmail("fred@gmail.com");
        user106.setPassword("password");

        Person user107 = new Person();
        user107.setUsername("Giraffe");
        user107.setEmail("giraffe@gmail.com");
        user107.setPassword("password");

        personSB.createPerson(user1);
        personSB.createPerson(user2);
        personSB.createPerson(user3);
        personSB.createPerson(user4);
        personSB.createPerson(user5);
        personSB.createPerson(user6);
        personSB.createPerson(user7);

        user101 = personSB.createPerson(user101);
        user102 = personSB.createPerson(user102);
        user103 = personSB.createPerson(user103);
        user104 = personSB.createPerson(user104);
        user105 = personSB.createPerson(user105);
        user106 = personSB.createPerson(user106);
        user107 = personSB.createPerson(user107);

        List<TopicEnum> ti1 = new ArrayList<>();
        List<TopicEnum> ti2 = new ArrayList<>();
        List<TopicEnum> ti3 = new ArrayList<>();
        List<TopicEnum> ti4 = new ArrayList<>();
        List<TopicEnum> ti5 = new ArrayList<>();
        List<TopicEnum> ti6 = new ArrayList<>();
        List<TopicEnum> ti7 = new ArrayList<>();

        ti1.add(TopicEnum.BLOCKCHAIN);
        ti1.add(TopicEnum.ETF);
        ti1.add(TopicEnum.CPF);
        ti1.add(TopicEnum.BTO);

        ti2.add(TopicEnum.BLOCKCHAIN);
        ti2.add(TopicEnum.CRYPTOCURRENCY);
        ti2.add(TopicEnum.CPF);
        ti2.add(TopicEnum.CREDITCARDS);

        ti3.add(TopicEnum.BLOCKCHAIN);
        ti3.add(TopicEnum.ETF);
        ti3.add(TopicEnum.INVESTMENTS);
        ti3.add(TopicEnum.ROBOADVISORS);

        ti4.add(TopicEnum.BLOCKCHAIN);
        ti4.add(TopicEnum.TRADING);
        ti4.add(TopicEnum.CPF);
        ti4.add(TopicEnum.REITS);

        ti5.add(TopicEnum.BLOCKCHAIN);
        ti5.add(TopicEnum.ETF);
        ti5.add(TopicEnum.INVESTMENTS);
        ti5.add(TopicEnum.ROBOADVISORS);

        ti6.add(TopicEnum.BLOCKCHAIN);
        ti6.add(TopicEnum.ETF);
        ti6.add(TopicEnum.INVESTMENTS);
        ti6.add(TopicEnum.ROBOADVISORS);

        ti7.add(TopicEnum.BLOCKCHAIN);
        ti7.add(TopicEnum.ETF);
        ti7.add(TopicEnum.INVESTMENTS);
        ti7.add(TopicEnum.ROBOADVISORS);

        user101.setIncomeRange(IncomeRangeEnum.LOW);
        user102.setIncomeRange(IncomeRangeEnum.MIDDLE);
        user103.setIncomeRange(IncomeRangeEnum.MIDDLE_HIGH);
        user104.setIncomeRange(IncomeRangeEnum.MIDDLE_LOW);
        user105.setIncomeRange(IncomeRangeEnum.NOT_EARNING);
        user106.setIncomeRange(IncomeRangeEnum.CRA);
        user107.setIncomeRange(IncomeRangeEnum.MIDDLE);

        user101.setDob(new Date());
        user102.setDob(new Date());
        user103.setDob(new Date());
        user104.setDob(new Date());
        user105.setDob(new Date());
        user106.setDob(new Date());
        user107.setDob(new Date());

        user101.setTopicInterests(ti1);
        user102.setTopicInterests(ti2);
        user103.setTopicInterests(ti3);
        user104.setTopicInterests(ti4);
        user105.setTopicInterests(ti5);
        user106.setTopicInterests(ti6);
        user107.setTopicInterests(ti7);

        try {
            personSB.onboarding(user101);
            personSB.onboarding(user102);
            personSB.onboarding(user103);
            personSB.onboarding(user104);
            personSB.onboarding(user105);
            personSB.onboarding(user106);
            personSB.onboarding(user107);
        } catch (NoResultException ex) {
            System.out.println("Error onboarding");
        }

    }

    private Date parseDate(String date) {
        try {
            return new SimpleDateFormat("dd/MM/yyyy").parse(date);
        } catch (ParseException e) {
            return new Date();
        }
    }

    private void editPersonDataInt() throws NoResultException, NotValidException {

        List<TopicEnum> ti1 = new ArrayList<>();
        List<TopicEnum> ti2 = new ArrayList<>();
        List<TopicEnum> ti3 = new ArrayList<>();
        List<TopicEnum> ti4 = new ArrayList<>();
        List<TopicEnum> ti5 = new ArrayList<>();
        List<TopicEnum> ti6 = new ArrayList<>();
        List<TopicEnum> ti7 = new ArrayList<>();

        ti1.add(TopicEnum.INVESTMENTS);
        ti1.add(TopicEnum.ETF);
        ti1.add(TopicEnum.CPF);
        ti1.add(TopicEnum.SAVINGS);

        ti2.add(TopicEnum.CRYPTOCURRENCY);
        ti2.add(TopicEnum.STOCKS);
        ti2.add(TopicEnum.INVESTMENTS);
        ti2.add(TopicEnum.ETF);

        ti3.add(TopicEnum.REAL_ESTATE);
        ti3.add(TopicEnum.REITS);
        ti3.add(TopicEnum.RETIREMENT);
        ti3.add(TopicEnum.BTO);

        ti4.add(TopicEnum.CRYPTOCURRENCY);
        ti4.add(TopicEnum.INVESTMENTS);

        ti5.add(TopicEnum.CRYPTOCURRENCY);
        ti5.add(TopicEnum.STOCKS);
        ti5.add(TopicEnum.TRADING);
        ti5.add(TopicEnum.INVESTMENTS);
        ti5.add(TopicEnum.BROKERAGES);

        ti6.add(TopicEnum.INSURANCE);
        ti6.add(TopicEnum.RETIREMENT);
        ti6.add(TopicEnum.SALARY);

        ti7.add(TopicEnum.CRYPTOCURRENCY);
        ti7.add(TopicEnum.STOCKS);
        ti7.add(TopicEnum.INVESTMENTS);

        Person user1 = personSB.getPerson(new Long(1));
        user1.setDescription("Hello I’m new! I would love to learn how to better manage my personal finance!");
        user1.setTopicInterests(ti1);
        user1.setDob(parseDate("12/03/1996"));
        user1.setIncomeRange(IncomeRangeEnum.LOW);

        user1.setProfileBanner("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FBanner%203.jpeg?alt=media&token=a47c9ed4-cbb4-4c9d-ba58-a1a24a9a67cb");
        user1.setProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FXMProfile.jpeg?alt=media&token=8df25640-7f20-4e22-8a60-64061a553fa8 ");

        personSB.updatePersonDataInt(user1);

        Person user2 = personSB.getPerson(new Long(2));
        user2.setDescription(" Keeping up with the candles! Subscribe to get access to all my secret tips and tricks! I stream every monday and friday!");
        user2.setTopicInterests(ti2);
        user2.setDob(parseDate("20/08/1986"));
        user2.setIncomeRange(IncomeRangeEnum.HIGH);

        user2.setProfileBanner("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FBanner%204.jpeg?alt=media&token=ed7d1766-f9a0-4145-aa8e-c727613835d7");
        user2.setProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FJennyProfile.jpeg?alt=media&token=59021e8e-216e-4578-b766-7207d877f672");

        personSB.updatePersonDataInt(user2);

        Person user3 = personSB.getPerson(new Long(3));
        user3.setDescription("Hello World.");
        user3.setTopicInterests(ti3);
        user3.setDob(parseDate("5/07/1990"));
        user3.setIncomeRange(IncomeRangeEnum.CRA);

        user3.setProfileBanner("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FBanner%207.jpeg?alt=media&token=35b61879-44bd-400d-aece-5aade229a07e");
        user3.setProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FAlanProfile.jpeg?alt=media&token=f945cc1f-cf76-4ed9-80e0-f6682ba87428");

        personSB.updatePersonDataInt(user3);

        Person user4 = personSB.getPerson(new Long(4));
        user4.setDescription("Big fan of BTC, ETH, ADA, LINK, CAKE, DOGE, FTT and BNB!");
        user4.setTopicInterests(ti4);
        user4.setDob(parseDate("16/01/2000"));
        user4.setIncomeRange(IncomeRangeEnum.MIDDLE);

        user4.setProfileBanner("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FBanner%202.jpeg?alt=media&token=382d3833-3d2e-4068-9687-7fd344e42c0f");
        user4.setProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FCryptoProfile.jpeg?alt=media&token=5657834a-7547-4c36-a6c9-ed6f98e49fa1");

        personSB.updatePersonDataInt(user4);

        Person user5 = personSB.getPerson(new Long(5));
        user5.setDescription("We are going on a trip on our favourite rocket ship, flying through the sky, little einstein! Let’s go to the moon!");
        user5.setTopicInterests(ti5);
        user5.setDob(parseDate("1/05/1976"));
        user5.setIncomeRange(IncomeRangeEnum.MIDDLE);

        user5.setProfileBanner("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FBanner%208.png?alt=media&token=6d384a64-1182-4cd0-bfa1-884d3588ae2d");
        user5.setProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FMoonProfile.jpeg?alt=media&token=859fc54b-f864-4022-b051-bae20e216d80");

        personSB.updatePersonDataInt(user5);

        Person user6 = personSB.getPerson(new Long(6));
        user6.setDescription("Not sure what kind of insurance you should buy? Come to The Insurance Guru! I stream every Monday! Only sharing the most relevant news!");
        user6.setTopicInterests(ti6);
        user6.setDob(parseDate("15/09/1988"));
        user6.setIncomeRange(IncomeRangeEnum.HIGH);

        user6.setProfileBanner("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FBanner%205.jpeg?alt=media&token=e682da4f-e6b9-4b32-8dc0-9fb322ebd019");
        user6.setProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FInsuranceProfile.jpeg?alt=media&token=c5e521db-405c-4cb9-b4c9-09f1a2db032e");

        personSB.updatePersonDataInt(user6);

        Person user7 = personSB.getPerson(new Long(7));
        user7.setDescription("All about crypto and stocks! I’LL HODL ALL THE WAY! APES STRONG TOGETHER! ");
        user7.setTopicInterests(ti7);
        user7.setDob(parseDate("11/11/1997"));
        user7.setIncomeRange(IncomeRangeEnum.LOW);

        user7.setProfileBanner("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FBanner%206.png?alt=media&token=e414206e-dfcf-450d-b4a1-aabb876ab253");
        user7.setProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FapeProfile.jpeg?alt=media&token=9b4f20e5-7f38-46e9-ad45-be50cbea4946");

        personSB.updatePersonDataInt(user7);
    }

    private void updateProfilePictures() throws NotValidException, NoResultException {
        Person person = personSB.getPersonById(new Long(1));
        person.setProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/1.jpeg?alt=media&token=b7a7f029-7934-42cc-8117-4ed9434c9e63");
        personSB.updatePerson(person);

        person = personSB.getPersonById(new Long(2));
        person.setProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/2.jpg?alt=media&token=ae0cd3a5-2a21-4175-b486-d312ef9b3f9b");
        personSB.updatePerson(person);

        person = personSB.getPersonById(new Long(3));
        person.setProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/3.png?alt=media&token=2f08d223-83f6-4ca4-92be-f520d2fdbe3b");
        personSB.updatePerson(person);

        person = personSB.getPersonById(new Long(4));
        person.setProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/4.jpg?alt=media&token=69f3a6ad-2760-44a1-8cef-71cc5afa83de");
        personSB.updatePerson(person);

        person = personSB.getPersonById(new Long(5));
        person.setProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/5.jpg?alt=media&token=83ca539e-7ecc-49aa-b963-f01534f015fe");
        personSB.updatePerson(person);

        person = personSB.getPersonById(new Long(6));
        person.setProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/6.png?alt=media&token=eb821955-61df-4541-a24b-fc5fdcf73fc1");
        personSB.updatePerson(person);

        person = personSB.getPersonById(new Long(7));
        person.setProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/7.png?alt=media&token=947053da-100e-45e8-9d04-4cb3308a6752");
        personSB.updatePerson(person);
    }

    private void createCommunities() throws NotValidException, NoResultException {
        String defaultCommunityPicture = "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Default%20Dp%20logo.svg?alt=media&token=8e2c7896-9e1f-4541-8934-bb00543bd9bb";
        String defaultCommunityBanner = "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Profile%20Banner%20Image.png?alt=media&token=e59ee28d-8388-4e81-8fd7-8d6409690897";

        List<TopicEnum> topicEnums = new ArrayList();

        Community comm1 = new Community();
        comm1.setDescription(" Your main source for CryptoCurrency News, Discussion & Analysis.");
        comm1.setName("Crypto");
        comm1.setCommunityProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FCryptoProfile.jpeg?alt=media&token=5657834a-7547-4c36-a6c9-ed6f98e49fa1");
        comm1.setCommunityBanner(defaultCommunityBanner);
        topicEnums.add(TopicEnum.CRYPTOCURRENCY);
        topicEnums.add(TopicEnum.INVESTMENTS);
        comm1.setTopicEnums(topicEnums);

        topicEnums = new ArrayList();
        Community comm2 = new Community();
        comm2.setDescription("Almost any post related to stocks is welcome here! Don't hesitate to tell us about a ticker we should know about. Everyone is welcome!");
        comm2.setName("Stocks");
        comm2.setCommunityProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FstocksCom.jpeg?alt=media&token=9019414a-7412-4889-9c87-b55d287a5791");
        comm2.setCommunityBanner(defaultCommunityBanner);
        topicEnums.add(TopicEnum.STOCKS);
        topicEnums.add(TopicEnum.TRADING);
        topicEnums.add(TopicEnum.BROKERAGES);
        topicEnums.add(TopicEnum.INVESTMENTS);
        comm2.setTopicEnums(topicEnums);

        topicEnums = new ArrayList();
        Community comm3 = new Community();
        comm3.setDescription("We discuss anything and everything about adulting in Singapore! Let’s manage our personal finance better together!");
        comm3.setName("AdultingInSG");
        comm3.setCommunityProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FadultingCom.png?alt=media&token=da0be368-82ce-40e8-90d9-c6d0486064fe");
        comm3.setCommunityBanner(defaultCommunityBanner);
        topicEnums.add(TopicEnum.CPF);
        topicEnums.add(TopicEnum.SAVINGS);
        topicEnums.add(TopicEnum.CAREER);
        topicEnums.add(TopicEnum.RETIREMENT);
        topicEnums.add(TopicEnum.SALARY);
        topicEnums.add(TopicEnum.CREDITCARDS);
        topicEnums.add(TopicEnum.BANKING);
        comm3.setTopicEnums(topicEnums);

        topicEnums = new ArrayList();
        Community comm4 = new Community();
        comm4.setDescription("Not a fan of taking risks but sick of putting your money in a bank? Join us on our journey to better investing with Roboadvisors");
        comm4.setName("RoboAdvisors");
        comm4.setCommunityProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FroboCom.jpeg?alt=media&token=35a275e8-3c6d-477e-b5a9-4793648c3fbf");
        comm4.setCommunityBanner(defaultCommunityBanner);
        topicEnums.add(TopicEnum.ROBOADVISORS);
        topicEnums.add(TopicEnum.STOCKS);
        comm4.setTopicEnums(topicEnums);

        topicEnums = new ArrayList();
        Community comm5 = new Community();
        comm5.setDescription("We know you have so much to ask about BTO. This is the place for you.");
        comm5.setName("BTOAimai");
        comm5.setCommunityProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FHDBCom.png?alt=media&token=d1c8cd50-7132-4154-add6-749ba5452d5e");
        comm5.setCommunityBanner(defaultCommunityBanner);
        topicEnums.add(TopicEnum.BTO);
        topicEnums.add(TopicEnum.REAL_ESTATE);
        comm5.setTopicEnums(topicEnums);

        topicEnums = new ArrayList();
        Community comm6 = new Community();
        comm6.setDescription("People might think we are a joke but if we get the money, we get it. TO THE MOON!");
        comm6.setName("MemeStocks");
        comm6.setCommunityProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FmemeCom.jpeg?alt=media&token=cb177052-1be2-4724-b7d6-4e3b8d92d941");
        comm6.setCommunityBanner(defaultCommunityBanner);
        topicEnums.add(TopicEnum.STOCKS);
        comm6.setTopicEnums(topicEnums);

        topicEnums = new ArrayList();
        Community comm7 = new Community();
        comm7.setDescription("A community dedicated to the discussion of long-term investments and value investing opportunities. We recognize the fact that cryptocurrency is here to stay as an investment vehicle. Posts regarding cryptocurrencies will be allowed, but please be cautious and complete your own due diligence on any investment choices you make.");
        comm7.setName("ClubInvest");
        comm7.setCommunityProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FinvestCom.jpeg?alt=media&token=42acf37e-87e8-4355-ad17-13da910b2bc3");
        comm7.setCommunityBanner(defaultCommunityBanner);
        topicEnums.add(TopicEnum.STOCKS);
        topicEnums.add(TopicEnum.TRADING);
        topicEnums.add(TopicEnum.BROKERAGES);
        topicEnums.add(TopicEnum.INVESTMENTS);
        topicEnums.add(TopicEnum.CRYPTOCURRENCY);
        topicEnums.add(TopicEnum.ETF);
        comm7.setTopicEnums(topicEnums);

        topicEnums = new ArrayList();
        Community comm8 = new Community();
        comm8.setDescription("You can be the next wolf of wall street!");
        comm8.setName("WallStreet");
        comm8.setCommunityProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FwallCom.jpg?alt=media&token=d63f8953-32cd-44ef-acdc-dcc9c8497f99");
        comm8.setCommunityBanner(defaultCommunityBanner);
        topicEnums.add(TopicEnum.STOCKS);
        topicEnums.add(TopicEnum.TRADING);
        topicEnums.add(TopicEnum.BROKERAGES);
        comm8.setTopicEnums(topicEnums);

        topicEnums = new ArrayList();
        Community comm9 = new Community();
        comm9.setDescription("It’s always better to be safe than sorry! Learn and share more about insurance!");
        comm9.setName("Insurance101");
        comm9.setCommunityProfilePicture("https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Data%20Init%2FinsuranceCom.jpeg?alt=media&token=80704787-ecb9-4131-a45e-4c4657884250");
        comm9.setCommunityBanner(defaultCommunityBanner);
        topicEnums.add(TopicEnum.INSURANCE);
        topicEnums.add(TopicEnum.RETIREMENT);
        comm9.setTopicEnums(topicEnums);

        communitySB.createCommunity(comm1, new Long(2));
        communitySB.createCommunity(comm2, new Long(2));
        communitySB.createCommunity(comm3, new Long(1));
        communitySB.createCommunity(comm4, new Long(1));
        communitySB.createCommunity(comm5, new Long(3));
        communitySB.createCommunity(comm6, new Long(5));
        communitySB.createCommunity(comm7, new Long(5));
        communitySB.createCommunity(comm8, new Long(7));
        communitySB.createCommunity(comm9, new Long(6));
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

        followSB.followPerson(new Long(8), new Long(1));
        followSB.followPerson(new Long(9), new Long(1));
        followSB.followPerson(new Long(10), new Long(1));
        followSB.followPerson(new Long(11), new Long(1));
        followSB.followPerson(new Long(12), new Long(1));
        followSB.followPerson(new Long(13), new Long(1));
        followSB.followPerson(new Long(14), new Long(1));
    }

    private void createSubs() throws NotValidException, NoResultException {
        subSB.subscribeToPerson(new Long(1), new Long(2), "");
        subSB.subscribeToPerson(new Long(1), new Long(3), "");
        subSB.subscribeToPerson(new Long(1), new Long(4), "");
        subSB.subscribeToPerson(new Long(1), new Long(5), "");
        subSB.unsubscribeToPerson(new Long(1), new Long(2));

        subSB.subscribeToPerson(new Long(5), new Long(1), "");
        subSB.subscribeToPerson(new Long(6), new Long(1), "");
        subSB.subscribeToPerson(new Long(7), new Long(1), "");

        subSB.subscribeToPerson(new Long(8), new Long(1), "");
        subSB.subscribeToPerson(new Long(9), new Long(1), "");
        subSB.subscribeToPerson(new Long(10), new Long(1), "");
        subSB.subscribeToPerson(new Long(11), new Long(1), "");
        subSB.subscribeToPerson(new Long(12), new Long(1), "");
        subSB.subscribeToPerson(new Long(13), new Long(1), "");
        subSB.subscribeToPerson(new Long(14), new Long(1), "");
    }

    private Poll createPoll() throws NotValidException, NoResultException {
        Poll postPoll = new Poll();
        postPoll.setQuestion("What do you think the price of bitcoin will reach in 2021?");

        String[] option = {"50k-75k", "75k-100k", "100k-200k", "200k-500k", "500k+"};

        for (int i = 0; i < option.length; i++) {
            String pollOption = option[i];
            PersonAnswer personAnswer1 = new PersonAnswer();
            PersonAnswer persistedPersonAnswer1 = paSB.createPersonAnswer(personAnswer1);
            postPoll.getOptions().put(pollOption, persistedPersonAnswer1);
        }
        return pollSB.createPoll(postPoll);
    }

    private Poll createPoll(String question, String[] option) throws NotValidException, NoResultException {
        Poll postPoll = new Poll();
        postPoll.setQuestion(question);

        for (int i = 0; i < option.length; i++) {
            String pollOption = option[i];
            PersonAnswer personAnswer1 = new PersonAnswer();
            PersonAnswer persistedPersonAnswer1 = paSB.createPersonAnswer(personAnswer1);
            postPoll.getOptions().put(pollOption, persistedPersonAnswer1);
        }
        return pollSB.createPoll(postPoll);
    }

    private void createPersonPost(Long personId) throws NotValidException, NoResultException {
        Post post1 = new Post();
        post1.setBody("Following breaking above the symmetrical triangle, bulls were able to drive the price of Bitcoin above prior resistance at the March 2021 high, which currently holds as support, allowing them to set another record above $63,000.\n"
                + "\n"
                + "With price action trading above both the 8 and 20-period EMA, both the Commodity Channel Index (CCI) and the Relative Strength Index (RSI) continue to test the upper bounds of their range, indicating that BTC/USD may soon enter into overbought territory. ");
        post1.setFileName("");
        post1.setFileUrl("");
        post1.setFileType("");
        post1.setDatePosted(new Date());

        postSB.createPostForPerson(personId, post1);
    }

    private void createCommunityPost(Long personId, Long communityId) throws NotValidException, NoResultException {
        Post post1 = new Post();
        post1.setBody("Just reminding people (regardless of which crypto your planning to sell) to not put sell orders at round numbers $1, $10, $1000, etc, as this adds to the resistance for that crypto at those psychological price levels.\n"
                + "Instead, put sell orders a few percent above or below those prices. This will reduce resistance at psychological price levels, which will do the rest of the crypto community a huge favour by making it easier for each crypto to break through specific price levels!");
        post1.setFileName("");
        post1.setFileUrl("");
        post1.setFileType("");
        post1.setDatePosted(new Date());

        postSB.createPostForCommunity(post1, personId, communityId);
    }

    private void createCommunityPost(Long personId, Long communityId, String body) throws NotValidException, NoResultException {
        Post post1 = new Post();
        post1.setBody(body);
        post1.setFileName("");
        post1.setFileUrl("");
        post1.setFileType("");
        post1.setDatePosted(new Date());

        postSB.createPostForCommunity(post1, personId, communityId);
    }

    private void createPersonPostWithPoll(Long personId) throws NotValidException, NoResultException {
        Post post2 = new Post();
        post2.setBody("Although cryptocurrencies continue to face rigorous scrutiny by global regulators, crowd psychology and speculation remain the primary catalysts of crypto price action with numerous alt coins now beginning to outpace Bitcoin’s recent performance. Should this dynamic continue, bears may push the price of Bitcoin towards the psychological level of $60,000, which could act as support");
        post2.setFileName("");
        post2.setFileUrl("");
        post2.setFileType("");
        post2.setPoll(createPoll());
        post2.setDatePosted(new Date());

        postSB.createPostForPerson(personId, post2);
    }

    private void createCommunityPostWithPoll(Long personId, Long communityId) throws NotValidException, NoResultException {
        Post post2 = new Post();
        post2.setBody("Today Bitcoin cleared a key resistance with ease, rallying the entire day on a big volume jump.");
        post2.setFileName("");
        post2.setFileUrl("");
        post2.setFileType("");
        post2.setPoll(createPoll());
        post2.setDatePosted(new Date());

        postSB.createPostForCommunity(post2, personId, communityId);
    }

    private void createCommunityPostWithPoll(Long personId, Long communityId, String body, String question, String[] option) throws NotValidException, NoResultException {
        Post post2 = new Post();
        post2.setBody(body);
        post2.setFileName("");
        post2.setFileUrl("");
        post2.setFileType("");
        post2.setPoll(createPoll(question, option));
        post2.setDatePosted(new Date());

        postSB.createPostForCommunity(post2, personId, communityId);
    }

    private void createComment(Long personId, Long postId) throws NotValidException, NoResultException {
        String[] comments = {
            "wow very cool",
            "never thought of that before",
            "i think this is an interesting post",
            "cool cool cool...",
            "i'm a big fan of your content"
        };

        Comment comment = new Comment();
        Random rand = new Random();
        int randomNum = rand.nextInt(comments.length);
        comment.setBody(comments[randomNum]);
        comment.setDatePosted(new Date());

        commentSB.createCommentForPost(personId, postId, comment);
    }

    private void createComments() throws NotValidException, NoResultException {
        createComment(new Long(1), new Long(1));
        createComment(new Long(2), new Long(1));
        createComment(new Long(3), new Long(1));
        createComment(new Long(4), new Long(1));
        createComment(new Long(5), new Long(1));
        createComment(new Long(6), new Long(1));
        createComment(new Long(5), new Long(3));
        createComment(new Long(6), new Long(3));

    }

    private void createReply(Long personId, Long commentId) throws NotValidException, NoResultException {
        String[] replies = {
            "wow very cool",
            "never thought of that before",
            "i think this is an interesting post",
            "cool cool cool...",
            "i'm a big fan of your content"
        };

        Reply reply = new Reply();
        Random rand = new Random();
        int randomNum = rand.nextInt(replies.length);
        reply.setBody(replies[randomNum]);
        reply.setDatePosted(new Date());

        replySB.createReplyForComment(personId, commentId, reply);
    }

    private void createReplies() throws NotValidException, NoResultException {
        createReply(new Long(2), new Long(1));
        createReply(new Long(3), new Long(1));
        createReply(new Long(4), new Long(1));
        createReply(new Long(2), new Long(2));
        createReply(new Long(3), new Long(2));
        createReply(new Long(4), new Long(2));

        createReply(new Long(2), new Long(7));
        createReply(new Long(3), new Long(7));
        createReply(new Long(4), new Long(8));

    }

    private void likePost() throws NoResultException, NotValidException {
        postSB.likePost(new Long(1), new Long(2));
        postSB.likePost(new Long(1), new Long(3));
        postSB.likePost(new Long(1), new Long(4));

        postSB.likePost(new Long(3), new Long(2));
    }

    private void likeComment() throws NoResultException, NotValidException {
        commentSB.likeComment(new Long(1), new Long(2));
        commentSB.likeComment(new Long(1), new Long(3));
        commentSB.likeComment(new Long(1), new Long(4));

        commentSB.likeComment(new Long(7), new Long(4));
    }

    private void likeReply() throws NoResultException, NotValidException {
        replySB.likeReply(new Long(1), new Long(2));
        replySB.likeReply(new Long(1), new Long(3));
    }

    private void addFollowing() throws NoResultException, NotValidException {
        communitySB.followCommunity(new Long(1), new Long(2));
        communitySB.followCommunity(new Long(1), new Long(3));
        communitySB.followCommunity(new Long(1), new Long(4));
        communitySB.followCommunity(new Long(1), new Long(5));
        communitySB.followCommunity(new Long(1), new Long(6));
    }

    private void ban() throws NoResultException, NotValidException {
        communitySB.banPerson(new Long(1), new Long(7), new Long(1));
    }

    private void createBadges() throws NotValidException {
        badgeSB.createBadges();
    }

    private void createAllCommunityPosts() throws NotValidException, NoResultException {
        // posts for roboAdvisors
        createCommunityPost(new Long(4), new Long(4), "After reading the answers in the forum, I am not sure to go for a robo-advisor or self pick the funds? What are some changes you would want to make, back when you just started investing?");
        createCommunityPost(new Long(3), new Long(4), "Should I move my funds in StashAway over to Syfe with the Syfe Equity100 rebalancing? \n"
                + "\n"
                + "I currently have an equal amount of funds in both StashAway (36% risk portfolio) and Syfe (Equity100) and have DCA for about a year now.The main reason why I chose StashAway is because of its exposure to Chinese stocks. The main reason why I chose Syfe is because of it's 100% equity portfolio. Now that Syfe's Equity100 is rebalancing which adds 2 Chinese stocks ETFs, should I move my funds and focus on just one portfolio instead?");
        createCommunityPost(new Long(4), new Long(4), " I noticed that my money in Syfe Cash+ has been decreasing and fluctuating, would it be more worth it if I store my money in Singlife/Dash instead?");
        createCommunityPost(new Long(5), new Long(4), "I only trust banks so I’m using OCBC RoboInvest.");
        String[] array = new String[]{
            "StashAway", "AutoWealth", "Syfe", "EndowUs"};
        createCommunityPostWithPoll(new Long(3), new Long(4),
                "There has been an increase in the number of Robo Advisors in the market! Comment down below if there are other platforms you want to recommend! ",
                "Which Robo Advisor are you using?",
                array
        );
        createCommunityPost(new Long(4), new Long(4), "RoboAdvisors are dumb!! Ur all idiots leaving ur $$ to tech. the robots r taking over our brains n stealing our jobs.");
    }

    private void initData() {

        try {
            createSiteWideAnalytics(); // has to be first
            createBadges();
            createMasterAdmin();
            createPersons();
            editPersonDataInt();
            // updateProfilePictures();
            createCommunities();
            createFollows();
            createSubs();
            createPersonPost(new Long(2));
            createPersonPostWithPoll(new Long(3));

            createCommunityPost(new Long(2), new Long(1));
            createCommunityPostWithPoll(new Long(2), new Long(1));
            createAllCommunityPosts();

            createComments();
            createReplies();
            likePost();
            likeComment();
            likeReply();

            addFollowing();
            ban();
            System.out.println("// COMPLETED INIT WITHOUT ERRORS //");

        } catch (NotValidException | NoResultException ex) {
            ex.printStackTrace();
        }
    }
}
