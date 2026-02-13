if(NOT TARGET react-native-reanimated::reanimated)
add_library(react-native-reanimated::reanimated SHARED IMPORTED)
set_target_properties(react-native-reanimated::reanimated PROPERTIES
    IMPORTED_LOCATION "/Users/ankitasahu/Developer/ZkAGI/zypherpunk/PawPad/node_modules/react-native-reanimated/android/build/intermediates/cxx/RelWithDebInfo/5g2aa3i1/obj/x86/libreanimated.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/ankitasahu/Developer/ZkAGI/zypherpunk/PawPad/node_modules/react-native-reanimated/android/build/prefab-headers/reanimated"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

