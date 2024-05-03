export class Util {
    static pascalCase(s: string) {
        return s.replace(/\w+/g, function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase();})
                .replace(/\s/g, "");
    }
}

//TODO: post refactor add this stuff
//builds paths to collections.
//appends slash for you.
export class CollectionPathBuilder {
    coll: string[];
    path: string[];

    constructor() {
        this.coll = [
            'WorkoutTemplates',
            'Workouts',
            'Users',
            'Instances'
        ]
        this.path = [];
    }

    history(): string {
        return 'History';
    }

    template(): CollectionPathBuilder {
        this.path.push(`${this.coll[0]}/`);
        return this;
    }

    workout(templateId: string): CollectionPathBuilder {
        this.path.push(`${templateId}/${this.coll[1]}`);
        return this;
    }

    user(workoutId: string): CollectionPathBuilder {
        this.path.push(`${workoutId}/${this.coll[2]}`);
        return this;
    }

    instance(userId: string): CollectionPathBuilder {
        this.path.push(`${userId}/${this.coll[3]}`);
        return this;
    }

    toString() {
        return this.path.join("");
    }
}