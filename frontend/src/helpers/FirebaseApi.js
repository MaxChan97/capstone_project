import { db } from "../firebase";

export function chatRefreshListener(setChatRefresh) {
  const unsubscribe = db
    .collection("ChatRefresh")
    .onSnapshot(function (querySnapshot) {
      querySnapshot.docChanges().forEach(function (changes) {
        if (changes.type === "added") {
          setChatRefresh((prevData) => {
            if (prevData.some((data) => data[0] === changes.doc.id)) {
              return prevData;
            } else {
              return setChatRefresh([...prevData, [changes.doc.id]]);
            }
          });
        } else if (changes.type === "modified") {
          setChatRefresh((prevData) =>
            prevData.map((data) => {
              if (data[0] === changes.doc.id) {
                return [changes.doc.id, changes.doc.data()];
              } else {
                return data;
              }
            })
          );
        } else if (changes.type === "removed") {
          setChatRefresh((prevData) =>
            prevData.map((data) => {
              if (data[0] !== changes.doc.id) {
                return data;
              }
            })
          );
        }
      });
    });
  return unsubscribe;
}

export function liveChatRefreshListener(setLiveChatRefresh) {
  const unsubscribe = db
    .collection("LiveChatRefresh")
    .onSnapshot(function (querySnapshot) {
      querySnapshot.docChanges().forEach(function (changes) {
        if (changes.type === "added") {
          setLiveChatRefresh((prevData) => {
            if (prevData.some((data) => data[0] === changes.doc.id)) {
              return prevData;
            } else {
              return setLiveChatRefresh([...prevData, [changes.doc.id]]);
            }
          });
        } else if (changes.type === "modified") {
          setLiveChatRefresh((prevData) =>
            prevData.map((data) => {
              if (data[0] === changes.doc.id) {
                return [changes.doc.id, changes.doc.data()];
              } else {
                return data;
              }
            })
          );
        } else if (changes.type === "removed") {
          setLiveChatRefresh((prevData) =>
            prevData.map((data) => {
              if (data[0] !== changes.doc.id) {
                return data;
              }
            })
          );
        }
      });
    });
  return unsubscribe;
}

export function livePollRefreshListener(setLivePollRefresh) {
  const unsubscribe = db
    .collection("LivePollRefresh")
    .onSnapshot(function (querySnapshot) {
      querySnapshot.docChanges().forEach(function (changes) {
        if (changes.type === "added") {
          setLivePollRefresh((prevData) => {
            if (prevData.some((data) => data[0] === changes.doc.id)) {
              return prevData;
            } else {
              return setLivePollRefresh([...prevData, [changes.doc.id]]);
            }
          });
        } else if (changes.type === "modified") {
          setLivePollRefresh((prevData) =>
            prevData.map((data) => {
              if (data[0] === changes.doc.id) {
                return [changes.doc.id, changes.doc.data()];
              } else {
                return data;
              }
            })
          );
        } else if (changes.type === "removed") {
          setLivePollRefresh((prevData) =>
            prevData.map((data) => {
              if (data[0] !== changes.doc.id) {
                return data;
              }
            })
          );
        }
      });
    });
  return unsubscribe;
}

export function streamRefreshListener(setStreamRefresh) {
  const unsubscribe = db
    .collection("StreamRefresh")
    .onSnapshot(function (querySnapshot) {
      querySnapshot.docChanges().forEach(function (changes) {
        if (changes.type === "added") {
          setStreamRefresh((prevData) => {
            if (prevData.some((data) => data[0] === changes.doc.id)) {
              return prevData;
            } else {
              return setStreamRefresh([...prevData, [changes.doc.id]]);
            }
          });
        } else if (changes.type === "modified") {
          setStreamRefresh((prevData) =>
            prevData.map((data) => {
              if (data[0] === changes.doc.id) {
                return [changes.doc.id, changes.doc.data()];
              } else {
                return data;
              }
            })
          );
        } else if (changes.type === "removed") {
          setStreamRefresh((prevData) =>
            prevData.map((data) => {
              if (data[0] !== changes.doc.id) {
                return data;
              }
            })
          );
        }
      });
    });
  return unsubscribe;
}
