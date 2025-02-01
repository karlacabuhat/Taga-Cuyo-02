// rejectContent.js

import { db } from "./firebase.js";
import { getDoc, doc, deleteDoc, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

window.rejectContent = async function(docId) {
    const docRef = doc(db, 'activities', docId);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
        console.error("No such document! Unable to reject.");
        return;
    }

    const data = docSnapshot.data();

    if (data.location === 'lesson' && data.lessonId) {
        const lessonDocRef = doc(db, 'lessons', data.lessonId);
        const wordsCollectionRef = collection(lessonDocRef, 'words');
        const wordSnapshot = await getDocs(wordsCollectionRef);

        for (const wordDoc of wordSnapshot.docs) {
            if (wordDoc.data().word === data.word) {
                await deleteDoc(wordDoc.ref);
                console.log(`Deleted word: ${data.word} from lesson.`);
            }
        }
    }

    await addDoc(collection(db, 'history'), {
        action: 'Rejected content',
        addedBy: data.addedBy,
        documentId: docId,
        contentDetails: `Word: ${data.word} - Translated: ${data.translated}`,
        adminAction: 'Rejected',
        timestamp: new Date(),
    });

    console.log(`Rejected content: ${data.word}`);
    loadHistory();
};
