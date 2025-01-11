import inflect


class Inflect:
    def __init__(self):
        self.p = inflect.engine()

    def __get_singular_noun(self, text):
        depluralized = self.p.singular_noun(text)
        if depluralized:
            return depluralized
        return text

    def __get_plural_noun(self, text):
        plural = self.p.plural(text)
        if plural:
            return plural
        return text

    def depluralize(self, text):
        words = text.split()  # Split the string into a list of words

        if not words:
            return text
        words[-1] = self.__get_singular_noun(words[-1])  # Replace the last word
        return " ".join(words)  # Join the words back into a string

    def pluralize(self, text):
        words = text.split()  # Split the string into a list of words

        if not words:
            return text
        words[-1] = self.__get_plural_noun(words[-1])  # Replace the last word
        return " ".join(words)  # Join the words back into a string
