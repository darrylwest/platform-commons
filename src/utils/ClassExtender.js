/**
 * Simple class extension of functions and public properties.  The best way to use this extender is for simple extension
 * of value objects or function objects.  Where it breaks down is if any of the base class's methods depend on the
 * state of it's variables--even if they are public.
 *
 * @created: 3/31/13 7:11 PM
 * @author: darryl.west@roundpeg.com
 */
var ClassExtender = {};

/**
 * extend : A static(ish) method to extend the parent capabilities to the child.
 *
 * Example 1: use this inside a class definition
 *  var MySuperMapper = function() {
 *      ClassExtender.extend( new AbstractMapper(), this );
 *      ...
 *  };
 *
 * Example 2: chained inheritance
 *  var Cat = function() {
 *  };
 *  ...
 *  var furryAnimal = ClassExtender.extend( new Animal(), new FurryPet() );
 *  var cat = ClassExtender.extend( furryAnimal, new Cat() );
 *  ...
 *
 *
 * @param parent - the base or abstract class
 * @param child - the inheriting class
 * @returns the child
 */
ClassExtender.extend = function(parent, child) {
    for (var key in parent) {
        // inherit
        child[ key ] = parent[ key ];
    }

    child.parent = parent;

    return child;
};