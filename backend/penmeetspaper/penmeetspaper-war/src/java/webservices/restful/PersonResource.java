/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.personEntities.Person;
import entity.personToPersonEntities.Follow;
import entity.personToPersonEntities.Subscription;
import enumeration.TopicEnum;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
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
import java.io.StringReader;
import java.util.ArrayList;
import javax.json.JsonArray;
import javax.json.JsonReader;

/**
 * REST Web Service
 *
 * @author carlc
 */
@Path("person")
public class PersonResource {

    @EJB
    private PersonSessionBeanLocal personSB;

    private JsonObject createJsonObject(String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        return reader.readObject();
    }

    private Response buildError(Exception e, int statusCode) {
        JsonObject exception = Json.createObjectBuilder()
                .add("error", e.getMessage())
                .build();

        return Response.status(statusCode).entity(exception)
                .type(MediaType.APPLICATION_JSON).build();
    }

    // Main Business logic -------------------------------------
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Person> getAllPerson() {
        return personSB.searchPersonByUsername(null);
    } //end getAllPerson

    @GET
    @Path("/query")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchPersonByUsername(@QueryParam("username") String username) {

        if (username != null) {
            List<Person> results = personSB.searchPersonByUsername(username);
            GenericEntity<List<Person>> entity = new GenericEntity<List<Person>>(results) {
            };

            return Response.status(200).entity(
                    entity
            ).build();
        } else {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "No query conditions")
                    .build();

            return Response.status(400).entity(exception).build();
        }
    } //end searchPersonByUsername

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPersonById(@PathParam("id") String id) {
        try {
            Person p = personSB.getPersonById(Long.valueOf(id));
            return Response.status(200).entity(
                    p
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } //end getPersonById

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
        p.setDescription("");
        try {
            Person addedPerson = personSB.createPerson(p);
            return Response.status(200).entity(
                    addedPerson
            ).type(MediaType.APPLICATION_JSON).build();

        } catch (NotValidException e) {
            return buildError(e, 400);
        }
    } //end createPerson

    /*@PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updatePerson(@PathParam("id") String id, Person p) {
        p.setId(Long.valueOf(id));
        try {
            personSessionLocal.updatePerson(p);
            return Response.status(204).build();
        } catch (NoResultException | NotValidException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", e.getMessage())
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end updatePerson*/
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editPersonProfileInformation(@PathParam("id") String id, @QueryParam("type") String editType, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);
        if (editType.equals("information")) {
            String username = jsonObject.getString("username");
            String description = jsonObject.getString("description");
            JsonArray topicInterestsJsonArray = jsonObject.getJsonArray("topicInterests");

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

            try {
                Person p = personSB.getPersonById(Long.valueOf(id));
                p.setUsername(username);
                p.setDescription(description);
                p.setTopicInterests(topicInterests);

                personSB.updatePerson(p);
                return Response.status(204).build();
            } catch (NoResultException | NotValidException e) {
                return buildError(e, 400);
            }
        } else if (editType.equals("profilePicture")) {
            return Response.status(422).build();
        } else {
            // editType.equals(profileBanner)
            return Response.status(422).build();
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
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", e.getMessage())
                    .build();

            return Response.status(400).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }

    }

    @GET
    @Path("/{id}/followers")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowers(@PathParam("id") Long id) {
        try {
            List<Follow> results = personSB.getFollowers(id);
            GenericEntity<List<Follow>> entity = new GenericEntity<List<Follow>>(results) {
            };

            return Response.status(200).entity(
                    entity
            ).build();

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

            return Response.status(200).entity(
                    entity
            ).build();

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

            return Response.status(200).entity(
                    entity
            ).build();

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

            return Response.status(200).entity(
                    entity
            ).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

}
