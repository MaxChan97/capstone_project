/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Comment;
import entity.Community;
import entity.Person;
import entity.PersonAnswer;
import entity.Poll;
import entity.Post;
import entity.Reply;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author Max
 */
@Stateless
public class PostSessionBean implements PostSessionBeanLocal {

    @PersistenceContext
    private EntityManager em;

    @EJB
    private PersonSessionBeanLocal personSB;

    @EJB
    private CommunitySessionBeanLocal cSB;

    // Helper methods to check and retrieve entities
    private Post emGetPost(Long postId) throws NoResultException, NotValidException {
        if (postId == null) {
            throw new NotValidException(PostSessionBeanLocal.MISSING_POST_ID);
        }

        Post post = em.find(Post.class, postId);

        if (post == null) {
            throw new NoResultException(PostSessionBeanLocal.CANNOT_FIND_POST);
        }

        return post;
    }

    private Person emGetPerson(Long personId) throws NoResultException, NotValidException {
        if (personId == null) {
            throw new NotValidException(PostSessionBeanLocal.MISSING_PERSON_ID);
        }

        Person person = em.find(Person.class, personId);

        if (person == null) {
            throw new NoResultException(PostSessionBeanLocal.CANNOT_FIND_PERSON);
        }

        return person;
    }

    private Community emGetCommunity(Long communityId) throws NoResultException, NotValidException {
        if (communityId == null) {
            throw new NotValidException(PostSessionBeanLocal.MISSING_COMMUNITY_ID);
        }

        Community community = em.find(Community.class, communityId);

        if (community == null) {
            throw new NoResultException(PostSessionBeanLocal.CANNOT_FIND_COMMUNITY);
        }

        return community;
    }

    @Override
    public void checkPostCredentials(Long postId, Long personId) throws NotValidException, NoResultException {
        Post post = emGetPost(postId);

        if (!Objects.equals(post.getAuthor().getId(), personId)) {
            throw new NotValidException(PostSessionBeanLocal.INVALID_CREDENTIALS);
        }
    }

    private Person getDetachedPerson(Person p) throws NoResultException, NotValidException {
        return personSB.getPersonById(p.getId());
    }

    private void detachLikes(List<Person> likes) throws NoResultException, NotValidException {
        for (Person person : likes) {
            person = getDetachedPerson(person);
        }
    }

    private Community getDetachCommunity(Community c) throws NoResultException, NotValidException {
        return cSB.getCommunityByIdForPost(c.getId());
    }

    // Main logic ---------------------------------------------------------------------
    @Override
    public void createPostForPerson(Long personId, Post post) throws NoResultException, NotValidException {

        if (post == null) {
            throw new NotValidException(PostSessionBeanLocal.MISSING_POST);
        }

        Person poster = emGetPerson(personId);

        post.setAuthor(poster);

        em.persist(post);
        poster.getPosts().add(post);

        personSB.addContributorPointsToPerson(personId, 3.0);
        personSB.checkBadgeQualification(personId);
        em.flush();

    } // end createPostForPerson

    @Override
    public void createPostForCommunity(Post post, Long personId, Long communityId)
            throws NoResultException, NotValidException {
        if (post == null) {
            throw new NotValidException(PostSessionBeanLocal.MISSING_POST);
        }

        Person person = emGetPerson(personId);
        Community community = emGetCommunity(communityId);

        post.setAuthor(person);
        post.setPostCommunity(community);

        em.persist(post);
        person.getPosts().add(post);
        community.getPosts().add(post);

        personSB.addContributorPointsToPerson(personId, 3.0);
        personSB.checkBadgeQualification(personId);
        em.flush();

    } // end createPostForCommunity

    @Override
    public List<Post> searchPostByTitle(String title) throws NoResultException, NotValidException {
        Query q;
        if (title != null) {
            q = em.createQuery("SELECT p FROM Post p WHERE " + "LOWER(p.title) LIKE :title");
            q.setParameter("title", "%" + title.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT p FROM Post p");
        }
        List<Post> posts = q.getResultList();

        for (Post p : posts) {
            p = getPostById(p.getId());
        }

        return posts;

    } // end searchPostByTitle

    @Override
    public void updatePost(Post post) throws NoResultException, NotValidException {
        if (post == null) {
            throw new NotValidException(PostSessionBeanLocal.MISSING_POST);
        }

        Post oldPost = emGetPost(post.getId());

        oldPost.setTitle(post.getTitle());
        oldPost.setBody(post.getBody());
        em.flush();

    } // end updatePost

    @Override
    public void deletePostForPerson(Long postId) throws NoResultException, NotValidException {
        Post post = emGetPost(postId);
        Person person = post.getAuthor();

        // unlinking
        person.getPosts().remove(post);
        post.setAuthor(null);

        em.remove(post);
    }

    @Override
    public void deletePostForCommunity(Long postId) throws NoResultException, NotValidException {
        Post post = emGetPost(postId);
        Person person = post.getAuthor();
        Community c = post.getPostCommunity();

        person.getPosts().remove(post);
        post.setAuthor(null);

        c.getPosts().remove(post);
        post.setPostCommunity(null);

        em.remove(post);
    }

    @Override
    public void likePost(Long postId, Long personId) throws NoResultException, NotValidException {
        Post post = emGetPost(postId);
        Person person = emGetPerson(personId);

        if (post.getLikes().contains(person)) {
            return;
        }

        post.getLikes().add(person);

    } // end likePost

    @Override
    public void unlikePost(Long postId, Long personId) throws NoResultException, NotValidException {
        Post post = emGetPost(postId);
        Person person = emGetPerson(personId);

        if (!post.getLikes().contains(person)) {
            return;
        }

        post.getLikes().remove(person);

    } // end unlikePost

    @Override
    public Post getPostById(Long postId) throws NoResultException, NotValidException {
        Post p = emGetPost(postId);
        em.detach(p);
        em.detach(p.getAuthor());

        Person postAuthor = p.getAuthor();
        p.setAuthor(getDetachedPerson(postAuthor));

        List<Comment> comments = p.getComments();

        detachLikes(p.getLikes());

        for (Comment c : comments) {
            Person commentAuthor = c.getAuthor();

            if (commentAuthor != null) {

                c.setAuthor(getDetachedPerson(commentAuthor));

            }

            detachLikes(c.getLikes());

            List<Reply> replies = c.getReplies();

            for (Reply r : replies) {
                Person replyAuthor = r.getAuthor();

                if (replyAuthor != null) {

                    r.setAuthor(getDetachedPerson(replyAuthor));

                }

                detachLikes(r.getLikes());
            }

        }

        Poll poll = p.getPoll();
        if (poll != null) {
            // detachPosts
            Set<Person> pollers = poll.getPollers();

            for (Person person : pollers) {
                person = getDetachedPerson(person);
            }

            for (PersonAnswer pa : poll.getOptions().values()) {
                List<Person> answeredBy = pa.getAnsweredBy();
                for (Person person : answeredBy) {
                    person = getDetachedPerson(person);
                }
            }
        }

        return p;
    } // end getPostById

    @Override
    public Post getPostById(Long postId, boolean withCommunity) throws NoResultException, NotValidException {
        Post p = getPostById(postId);

        Community c = p.getPostCommunity();

        if (c != null) {
            System.out.println(c.getId());
            if (withCommunity) {
                p.setPostCommunity(getDetachCommunity(c));
            } else {
                p.setPostCommunity(null);
            }
        } else {
            throw new NoResultException(PostSessionBeanLocal.CANNOT_FIND_COMMUNITY);
        }
        return p;
    }
    
    @Override
    public List<Post> searchPostByBody(String searchTerm) throws NoResultException, NotValidException {
        Query q;
        if (searchTerm != null) {
            q = em.createQuery("SELECT p FROM Post p WHERE LOWER(p.body) LIKE :searchTerm");
            q.setParameter("searchTerm", "%" + searchTerm.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT p FROM Post p");
        }
        List<Post> postList = q.getResultList();
        System.out.println(postList.size());
        for (Post p : postList) {
            if (p.getPostCommunity() == null) {
                // not a community post
                p = getPostById(p.getId());
            } else {
                // a community post
                p = getPostById(p.getId(), true);
            }
        }
        return postList;
    }
}
