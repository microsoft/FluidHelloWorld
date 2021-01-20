export const getDocId = (): { docId: string; isNew: boolean } => {
    let isNew = false;
    if (location.hash.length === 0) {
        isNew = true;
        location.hash = Date.now().toString();
    }
    const docId = location.hash.substring(1);
    return { docId, isNew };
};
