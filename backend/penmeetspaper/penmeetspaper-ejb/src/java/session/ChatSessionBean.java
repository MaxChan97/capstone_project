/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.messagingEntities.Chat;
import entity.messagingEntities.Message;
import entity.personEntities.Person;
import exception.NoResultException;
import exception.NotValidException;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author Max
 */
@Stateless
public class ChatSessionBean implements ChatSessionBeanLocal {

    @EJB
    private PersonSessionBeanLocal personSB;

    @PersistenceContext
    private EntityManager em;

    private Person getDetachedPerson(Person p) throws NoResultException, NotValidException {
        return personSB.getPersonById(p.getId());
    }

    @Override
    public Chat createChat(Long senderId, Long recipientId, Message message) throws NoResultException, NotValidException {
        Person sender = em.find(Person.class, senderId);
        Person recipient = em.find(Person.class, recipientId);

        Chat newChat = new Chat();
        newChat.getChatParticipants().add(sender);
        newChat.getChatParticipants().add(recipient);

        message.setSender(sender);
        message.setRecipient(recipient);
        em.persist(message);
        newChat.addChatMessage(message);

        em.persist(newChat);

        sender.getChats().add(newChat);
        recipient.getChats().add(newChat);

        em.flush();

        for (Person person : newChat.getChatParticipants()) {
            person = getDetachedPerson(person);
        }

        return newChat;
    }

    public Date getDateOfLastChatMessage(Chat chat) {
        if (chat.getChatMessages().size() != 0) {
            return chat.getChatMessages().get(chat.getChatMessages().size() - 1).getDateTime();
        } else {
            // not a valid case i.e. wont reach here, all chats will have at least
            // one msg
            return null;
        }
    }

    @Override
    public List<Chat> getPersonsChat(Long personId) throws NoResultException, NotValidException {
        Person person = em.find(Person.class, personId);
        List<Chat> chats = person.getChats();
        for (Chat c : chats) {
            em.detach(c);
            List<Person> chatParticipants = c.getChatParticipants();
            for (Person p : chatParticipants) {
                p = getDetachedPerson(p);
            }
            List<Message> chatMessages = c.getChatMessages();
            for (Message m : chatMessages) {
                Person sender = m.getSender();
                Person recipient = m.getRecipient();

                em.detach(m.getSender());
                Person detachedSender = getDetachedPerson(sender);
                m.setSender(detachedSender);

                em.detach(m.getRecipient());
                Person detachedRecipient = getDetachedPerson(recipient);
                m.setRecipient(detachedRecipient);
            }
        }
        // Must sort this chats before returning
        Collections.sort(chats, new Comparator<Chat>() {
            public int compare(Chat c1, Chat c2) {
                if (getDateOfLastChatMessage(c1) == null || getDateOfLastChatMessage(c2) == null) {
                    return 0;
                }
                return getDateOfLastChatMessage(c2).compareTo(getDateOfLastChatMessage(c1));
            }
        });
        return chats;
    }

    @Override
    public void setAllMessagesAsOpened(Long chatId) {
        Chat chat = em.find(Chat.class, chatId);
        for (Message m : chat.getChatMessages()) {
            m.setOpened(true);
        }
    }
}
