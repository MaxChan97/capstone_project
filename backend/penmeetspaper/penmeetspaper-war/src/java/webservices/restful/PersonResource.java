/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.Community;
import entity.Post;
import entity.personEntities.Person;
import entity.personToPersonEntities.Follow;
import entity.personToPersonEntities.Subscription;
import enumeration.IncomeRangeEnum;
import enumeration.TopicEnum;
import exception.NoResultException;
import exception.NotValidException;
import java.io.StringReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.PersonSessionBeanLocal;
import session.SubscriptionSessionBeanLocal;

/**
 * REST Web Service
 *
 * @author carlc
 */
@Path("person")
public class PersonResource {

    @EJB
    private PersonSessionBeanLocal personSB;

    @EJB
    private SubscriptionSessionBeanLocal subscriptionSB;

    private JsonObject createJsonObject(String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        return reader.readObject();
    }

    private Response buildError(Exception e, int statusCode) {
        JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();

        return Response.status(statusCode).entity(exception).type(MediaType.APPLICATION_JSON).build();
    }

    private List<TopicEnum> convertToTopicEnumList(JsonArray topicInterestsJsonArray) {
        List<TopicEnum> topicInterests = new ArrayList<TopicEnum>();

        for (int i = 0; i < topicInterestsJsonArray.size(); i++) {
            String topicInterest = topicInterestsJsonArray.getString(i);
            if ("REAL_ESTATE".equals(topicInterest)) {
                topicInterests.add(TopicEnum.REAL_ESTATE);
            } else if ("STOCKS".equals(topicInterest)) {
                topicInterests.add(TopicEnum.STOCKS);
            } else if ("FUTURES".equals(topicInterest)) {
                topicInterests.add(TopicEnum.FUTURES);
            } else if ("CRYPTOCURRENCY".equals(topicInterest)) {
                topicInterests.add(TopicEnum.CRYPTOCURRENCY);
            }
        }

        return topicInterests;
    }

    private IncomeRangeEnum convertToIncomeRangeEnum(String str) throws NotValidException {
        if (str.equals("NOT_EARNING")) {
            return IncomeRangeEnum.NOT_EARNING;
        } else if (str.equals("LOW")) {
            return IncomeRangeEnum.LOW;
        } else if (str.equals("MIDDLE_LOW")) {
            return IncomeRangeEnum.MIDDLE_LOW;
        } else if (str.equals("MIDDLE")) {
            return IncomeRangeEnum.MIDDLE;
        } else if (str.equals("MIDDLE_HIGH")) {
            return IncomeRangeEnum.MIDDLE_HIGH;
        } else if (str.equals("HIGH")) {
            return IncomeRangeEnum.HIGH;
        } else if (str.equals("CRA")) {
            return IncomeRangeEnum.CRA;
        }

        throw new NotValidException("could not match income range");
    }

    // Main Business logic -------------------------------------
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createPerson(String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);

        String email = jsonObject.getString("email");
        String username = jsonObject.getString("username");
        String password = jsonObject.getString("password");
        Person p = new Person();
        p.setEmail(email);
        p.setUsername(username);
        // Might want to hash password, see how
        p.setPassword(password);

        try {
            Person addedPerson = personSB.createPerson(p);
            return Response.status(200).entity(addedPerson).type(MediaType.APPLICATION_JSON).build();

        } catch (NotValidException e) {
            return buildError(e, 400);
        }
    } // end createPerson

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllPerson() {
        try {
            List<Person> personList = personSB.searchPersonByUsername(null);

            GenericEntity<List<Person>> entity = new GenericEntity<List<Person>>(personList) {
            };

            return Response.status(200).entity(entity).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end getAllPerson

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPersonById(@PathParam("id") String id) {
        try {
            Person p = personSB.getPersonById(Long.valueOf(id));
            return Response.status(200).entity(p).type(MediaType.APPLICATION_JSON).build();
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end getPersonById

    @GET
    @Path("/query")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchPersonByUsername(@QueryParam("username") String username) {
        try {
            if (username != null) {
                List<Person> results = personSB.searchPersonByUsername(username);
                GenericEntity<List<Person>> entity = new GenericEntity<List<Person>>(results) {
                };

                return Response.status(200).entity(entity).build();
            } else {
                JsonObject exception = Json.createObjectBuilder().add("error", "No query conditions").build();

                return Response.status(400).entity(exception).build();
            }
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end searchPersonByUsername

    @GET
    @Path("/email/{email}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPersonByEmail(@PathParam("email") String email) {
        try {
            Person p = personSB.getPersonByEmail(email);
            return Response.status(200).entity(p).type(MediaType.APPLICATION_JSON).build();
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end getPersonByEmail

    @GET
    @Path("/{id}/followers")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowers(@PathParam("id") Long id) {
        try {
            List<Follow> results = personSB.getFollowers(id);
            GenericEntity<List<Follow>> entity = new GenericEntity<List<Follow>>(results) {
            };

            return Response.status(200).entity(entity).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

    @GET
    @Path("/{id}/following")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowing(@PathParam("id") Long id) {
        try {
            List<Follow> results = personSB.getFollowing(id);
            GenericEntity<List<Follow>> entity = new GenericEntity<List<Follow>>(results) {
            };

            return Response.status(200).entity(entity).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

    @GET
    @Path("/{id}/subscriptions")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSubscriptions(@PathParam("id") Long id) {
        try {
            List<Subscription> results = personSB.getSubscription(id);
            GenericEntity<List<Subscription>> entity = new GenericEntity<List<Subscription>>(results) {
            };

            return Response.status(200).entity(entity).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

    @GET
    @Path("/{id}/subscribers")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSubscribers(@PathParam("id") Long id) {
        try {
            List<Subscription> results = personSB.getPublications(id);
            GenericEntity<List<Subscription>> entity = new GenericEntity<List<Subscription>>(results) {
            };

            return Response.status(200).entity(entity).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

    @GET
    @Path("/{personId}/followingandowned")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowingAndOwned(@PathParam("personId") Long personId) {
        try {
            List<Community> results = personSB.getFollowingAndOwnedCommunities(personId);
            GenericEntity<List<Community>> entity = new GenericEntity<List<Community>>(results) {
            };

            return Response.status(200).entity(entity).build();
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

    @GET
    @Path("/{personId}/followingCommunities")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowingCommunities(@PathParam("personId") Long personId) {
        try {
            List<Community> results = personSB.getFollowingCommunities(personId);
            GenericEntity<List<Community>> entity = new GenericEntity<List<Community>>(results) {
            };

            return Response.status(200).entity(entity).build();
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

    @GET
    @Path("/{personId}/ownedCommunities")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOwnedCommunities(@PathParam("personId") Long personId) {
        try {
            List<Community> results = personSB.getOwnedCommunities(personId);
            GenericEntity<List<Community>> entity = new GenericEntity<List<Community>>(results) {
            };

            return Response.status(200).entity(entity).build();
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

    @GET
    @Path("/{personId}/followingPosts")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowingPost(@PathParam("personId") Long personId) {
        try {
            List<Post> results = personSB.getFollowingPosts(personId);
            GenericEntity<List<Post>> entity = new GenericEntity<List<Post>>(results) {
            };

            return Response.status(200).entity(entity).build();
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

    @GET
    @Path("/{personId}/isSubscribedTo/{publisherId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response isSubscribed(@PathParam("personId") Long personId, @PathParam("publisherId") Long publisherId) {

        try {
            String result = subscriptionSB.isSubscribed(personId, publisherId);
            JsonObject returnJson = Json.createObjectBuilder().add("subscriptionStatus", result).build();

            return Response.status(200).entity(returnJson).type(MediaType.APPLICATION_JSON).build();
        } catch (NotValidException e) {
            return buildError(e, 400);
        }
    }

    @GET
    @Path("/{id}/posts")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPersonsPost(@PathParam("id") Long personId) {
        try {

            List<Post> results = personSB.getPersonsPost(personId);
            GenericEntity<List<Post>> entity = new GenericEntity<List<Post>>(results) {
            };

            return Response.status(200).entity(entity).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end getPersonsPost

    @GET
    @Path("/{id}/followingCommunityPosts")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowingCommunityPost(@PathParam("id") Long personId) {
        try {

            List<Post> results = personSB.getFollowingCommunityPosts(personId);
            GenericEntity<List<Post>> entity = new GenericEntity<List<Post>>(results) {
            };

            return Response.status(200).entity(entity).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end getPersonsPost

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editPersonProfileInformation(@PathParam("id") Long personId, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);

        String username = jsonObject.getString("username");
        String description = jsonObject.getString("description");
        JsonArray topicInterestsJsonArray = jsonObject.getJsonArray("topicInterests");
        String profilePicture = jsonObject.getString("profilePicture");
        String profileBanner = jsonObject.getString("profileBanner");

        List<TopicEnum> topicInterests = convertToTopicEnumList(topicInterestsJsonArray);

        try {
            Person p = personSB.getPersonById(personId);
            p.setUsername(username);
            p.setDescription(description);
            p.setTopicInterests(topicInterests);
            p.setProfilePicture(profilePicture);
            p.setProfileBanner(profileBanner);

            personSB.updatePerson(p);
            return Response.status(204).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }

    }

    @PUT
    @Path("/{id}/settings")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editPersonSettings(@PathParam("id") Long id, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);

        Boolean explicit = jsonObject.getBoolean("explicit");
        Boolean subscriberOnly = jsonObject.getBoolean("subscriberOnly");

        try {
            Person person = personSB.getPersonById(id);
            person.setHasExplicitLanguage(explicit);
            person.setChatIsPaid(subscriberOnly);

            personSB.updatePerson(person);

            return Response.status(204).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

    @PUT
    @Path("/{id}/pricingPlan")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editPersonPricingPlan(@PathParam("id") Long id, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);

        Double pricingPlan = Double.valueOf(jsonObject.getString("pricingPlan"));

        try {
            Person person = personSB.getPersonById(id);
            person.setPricingPlan(pricingPlan);

            personSB.updatePricingPlan(person);

            return Response.status(204).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

    @PUT
    @Path("/{id}/onboarding")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response onboarding(@PathParam("id") Long id, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);

        String incomeRangeStr = jsonObject.getString("incomeRangeEnum");
        String dobStr = jsonObject.getString("dob");

        try {
            IncomeRangeEnum incomeRange = convertToIncomeRangeEnum(incomeRangeStr);
            Date dob = new SimpleDateFormat("dd/MM/yyyy").parse(dobStr);

            Person person = personSB.getPersonById(id);
            person.setIncomeRange(incomeRange);
            person.setDob(dob);

            personSB.onboarding(person);

            return Response.status(204).build();

        } catch (NoResultException | NotValidException | ParseException e) {
            return buildError(e, 400);
        }
    }

    @PUT
    @Path("/saveResetId/{email}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response saveResetId(@PathParam("email") String email, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);
        String resetId = jsonObject.getString("resetId");
        try {
            Person p = personSB.getPersonByEmail(email);
            p.setResetId(resetId);
            personSB.updatePerson(p);
            p = personSB.getPersonById(p.getId());
            return Response.status(200).entity(p).type(MediaType.APPLICATION_JSON).build();
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end saveResetId

    @PUT
    @Path("/resetPassword/{resetId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response resetPassword(@PathParam("resetId") String resetId, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);
        String newPassword = jsonObject.getString("newPassword");

        try {
            if (newPassword == null) {
                throw new NotValidException(PersonSessionBeanLocal.MISSING_PASSWORD);
            }
            Person p = personSB.getPersonByResetId(resetId);
            p.setPassword(newPassword);
            personSB.updatePerson(p);
            p = personSB.getPersonById(p.getId());
            return Response.status(200).entity(p).type(MediaType.APPLICATION_JSON).build();
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end resetPassword

    @PUT
    @Path("/changePassword/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response changePassword(@PathParam("id") Long id, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);
        String oldPassword = jsonObject.getString("oldPassword");
        String newPassword = jsonObject.getString("newPassword");

        try {
            if (oldPassword == null) {
                throw new NotValidException(PersonSessionBeanLocal.MISSING_PASSWORD);
            }
            if (newPassword == null) {
                throw new NotValidException(PersonSessionBeanLocal.MISSING_PASSWORD);
            }
            Person p = personSB.getPersonById(id);
            if (!p.getPassword().equals(oldPassword)) {
                throw new NotValidException(PersonSessionBeanLocal.WRONG_PASSWORD);
            }
            p.setPassword(newPassword);
            personSB.updatePerson(p);
            return Response.status(204).build();
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end changePassword
}
