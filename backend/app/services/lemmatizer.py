from typing import List, Set, Optional
import lemminflect


def lemmatize_english_word(word: str, upos: Optional[str] = None) -> str:
    clean = word.strip().lower()
    if not clean:
        return word

    if upos:
        lemmas = lemminflect.getLemma(clean, upos=upos)
        if lemmas:
            return lemmas[0]

    all_lemmas = lemminflect.getAllLemmas(clean)
    if all_lemmas:
        for tag in ("NOUN", "VERB", "ADJ", "ADV"):
            if tag in all_lemmas:
                for lem in all_lemmas[tag]:
                    if lem != clean:
                        return lem

        for tag in ("NOUN", "VERB", "ADJ", "ADV"):
            if tag in all_lemmas and all_lemmas[tag]:
                return all_lemmas[tag][0]

    return clean


def get_english_candidate_stems(word: str) -> List[str]:
    clean = word.strip().lower()
    if not clean:
        return []

    candidates = [clean]
    all_lemmas = lemminflect.getAllLemmas(clean)
    if all_lemmas:
        for tag_lemmas in all_lemmas.values():
            for lem in tag_lemmas:
                if lem not in candidates:
                    candidates.append(lem)

    return candidates


def get_english_word_forms(word: str) -> Set[str]:
    clean = word.strip().lower()
    if not clean:
        return set()

    forms: Set[str] = {clean}
    stems = get_english_candidate_stems(clean)
    for stem in stems:
        forms.add(stem)
        infl_dict = lemminflect.getAllInflections(stem)
        for inf_tuple in infl_dict.values():
            for form in inf_tuple:
                forms.add(form.lower())

    return forms
