package com.anthill.coinswapscannermvc.security;

public class MD5 {

    public static String getHash(String md5) {
        try {
                java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5");
                byte[] array = md.digest(md5.getBytes());
                StringBuffer buffer = new StringBuffer();

                for (int i = 0; i < array.length; ++i) {
                    buffer.append(Integer.toHexString((array[i] & 0xFF) | 0x100).substring(1,3));
                }
            return buffer.toString();
        } catch (java.security.NoSuchAlgorithmException ignored) {}

        return "";
    }
}
